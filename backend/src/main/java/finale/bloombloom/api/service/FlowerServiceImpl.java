package finale.bloombloom.api.service;

import finale.bloombloom.api.request.BouquetSaveRequest;
import finale.bloombloom.api.request.FlowerRequest;
import finale.bloombloom.api.response.*;
import finale.bloombloom.common.exception.BloomBloomNotFoundException;
import finale.bloombloom.common.model.FileFolder;
import finale.bloombloom.common.util.S3ImageUrlConverter;
import finale.bloombloom.db.entity.Bouquet;
import finale.bloombloom.db.entity.FlowerInfo;
import finale.bloombloom.db.entity.Order;
import finale.bloombloom.db.entity.User;
import finale.bloombloom.db.entity.metadata.Deco;
import finale.bloombloom.db.entity.metadata.MainFlower;
import finale.bloombloom.db.entity.metadata.SubFlower;
import finale.bloombloom.db.entity.metadata.Wrap;
import finale.bloombloom.db.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlowerServiceImpl implements FlowerService{
    private final FileProcessService fileProcessService;
    private final UserRepository userRepository;
    private final BouquetRepository bouquetRepository;
    private final MainFlowerRepository mainFlowerRepository;
    private final SubFlowerRepository subFlowerRepository;
    private final DecoRepository decoRepository;
    private final WrapRepository wrapRepository;
    private final FlowerInfoRepository flowerInfoRepository;
    private final PresentRepository presentRepository;
    private final OrderRepository orderRepository;
    private final S3ImageUrlConverter urlConverter;

    @Override
    public List<MainFlowerResponse> findAllMainFlower() {
        return mainFlowerRepository.findAll().stream()
                .map(mainFlower -> MainFlowerResponse.from(mainFlower, urlConverter))
                .collect(Collectors.toList());
    }

    @Override
    public List<SubFlowerResponse> findAllSubFlower() {
        return subFlowerRepository.findAll().stream()
                .map(SubFlowerResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<WrapResponse> findAllWrap() {
        return wrapRepository.findAll().stream()
                .map(WrapResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<DecoResponse> findAllDeco() {
        return decoRepository.findAll().stream()
                .map(DecoResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<BouquetResponse> findBouquet(Long userSeq) {
        return bouquetRepository.findByUser_UserSeqOrderByBouquetSeqDesc(userSeq).stream()
                .map(bouquet -> BouquetResponse.from(bouquet, urlConverter))
                .collect(Collectors.toList());
    }

    @Override
    public BouquetDetailResponse findBouquetDetail(Long bouquetSeq) {
        Bouquet bouquet = findBouquetDetailByBouquetSeq(bouquetSeq);
        List<FlowerInfo> flowerInfos = flowerInfoRepository.findByBouquet_BouquetSeq(bouquetSeq);
        return BouquetDetailResponse.from(bouquet, flowerInfos, urlConverter);
    }

    @Override
    @Transactional
    public BouquetSaveResponse saveBouquet(Long userSeq, BouquetSaveRequest request, MultipartFile file) {
        Optional<Deco> deco = decoRepository.findById(request.getDecoSeq());
        Optional<Wrap> wrap = wrapRepository.findById(request.getWrapSeq());
        Optional<SubFlower> subFlower = subFlowerRepository.findById(request.getSubFlowerSeq());
        Optional<User> user = userRepository.findById(userSeq);

        if (user.isEmpty() || deco.isEmpty() || subFlower.isEmpty() || wrap.isEmpty())
            throw new BloomBloomNotFoundException("???????????? ????????? ?????? ??? ????????????.");

        // 1. ????????? ???????????? S3??? ?????? ??? ????????? ???????????????.
        String bouquetImage = null;
        try {
            bouquetImage = fileProcessService.upload(FileFolder.BOUQUET_FOLDER, file);
        } catch (IOException e) {
            log.error("????????? ???????????? ??????????????????.");
            e.printStackTrace();
        }

        // 2. bouquet ???????????? ??????
        Bouquet bouquet = bouquetRepository.save(Bouquet.builder()
                .user(user.get())
                .subFlower(subFlower.get())
                .wrap(wrap.get())
                .deco(deco.get())
                .bouquetImage(bouquetImage)
                .build());

        // 3. flower_info ???????????? ??????
        saveFlowerInfo(request, bouquet);

        return BouquetSaveResponse.from(bouquet, urlConverter);
    }

    @Override
    @Transactional
    public void deleteBouquet(Long bouquetSeq) {
        // ???????????? ??????
        presentRepository.deleteByBouquet_BouquetSeq(bouquetSeq);
        // ????????? ??????
        flowerInfoRepository.deleteByBouquet_BouquetSeq(bouquetSeq);
        // ?????? ??????
        orderRepository.deleteByBouquet_BouquetSeq(bouquetSeq);
        // ????????? ??????
        bouquetRepository.deleteById(bouquetSeq);
    }

    @Override
    public RecentBouquetResponse findRecentBouquet(Long userSeq, Pageable pageable) {
        // 1. ?????? ????????? ????????? ?????? (BouquetResponse ????????? ??????)
        List<BouquetResponse> makeBouquetList = bouquetRepository.findByUser_UserSeqOrderByBouquetSeqDesc(userSeq, pageable).stream()
                .map(bouquet -> BouquetResponse.from(bouquet, urlConverter))
                .collect(Collectors.toList());

        // 1. ?????? ????????? ?????? ?????? ??????
        List<Order> orderList = orderRepository.findByUser_UserSeqOrderByOrderSeqDesc(userSeq, pageable);
        // 2. ?????? ????????? ???????????? ?????? ????????? ????????? ?????? (BouquetResponse ????????? ??????)
        List<BouquetResponse> orderBouquetList = findOrderBouquetListByOrderList(orderList).stream()
                .map(bouquet -> BouquetResponse.from(bouquet, urlConverter))
                .collect(Collectors.toList());

        return new RecentBouquetResponse(makeBouquetList, orderBouquetList);
    }

    private List<Bouquet> findOrderBouquetListByOrderList(List<Order> orderList) {
        return orderList.stream()
                .map(order -> bouquetRepository.findById(order.getBouquet().getBouquetSeq()).orElseThrow(() -> new BloomBloomNotFoundException("????????? ???????????? ???????????? ????????????.")))
                .collect(Collectors.toList());
    }

    private void saveFlowerInfo(BouquetSaveRequest request, Bouquet bouquet) {
        List<FlowerRequest> mainFlower = request.getMainFlower();
        mainFlower.stream().forEach(f -> {
            // 1. flowerSeq ??? MainFlower ???????????? ?????????.
            MainFlower flower = findMainFlowerByFlower(f);
            // 2. builder ??? ???????????? FlowerInfo ????????? ??????
            FlowerInfo flowerInfo = FlowerInfo.builder()
                    .mainFlower(flower)
                    .flowerInfoCount(f.getFlowerCount())
                    .bouquet(bouquet)
                    .build();
            // 3. ??????
            flowerInfoRepository.save(flowerInfo);
        });
    }

    private MainFlower findMainFlowerByFlower(FlowerRequest f) {
        return mainFlowerRepository.findById(f.getFlowerSeq())
                .orElseThrow(() -> new BloomBloomNotFoundException("???????????? ????????? ?????? ??? ????????????."));
    }

    private Bouquet findBouquetDetailByBouquetSeq(Long bouquetSeq) {
        return bouquetRepository.findById(bouquetSeq)
                .orElseThrow(() -> new BloomBloomNotFoundException(String.format("?????? ???????????? ???????????? ????????????. ID : %d", bouquetSeq)));
    }

}
