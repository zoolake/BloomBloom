package finale.bloombloom.api.service;

import finale.bloombloom.api.response.*;
import finale.bloombloom.common.exception.BloomBloomNotFoundException;
import finale.bloombloom.db.entity.Bouquet;
import finale.bloombloom.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlowerService {
    private final BouquetRepository bouquetRepository;
    private final MainFlowerRepository mainFlowerRepository;
    private final SubFlowerRepository subFlowerRepository;
    private final DecoRepository decoRepository;
    private final WrapRepository wrapRepository;

    public List<MainFlowerResponse> findAllMainFlower() {
        return mainFlowerRepository.findAll().stream()
                .map(MainFlowerResponse::from)
                .collect(Collectors.toList());
    }

    public List<SubFlowerResponse> findAllSubFlower() {
        return subFlowerRepository.findAll().stream()
                .map(SubFlowerResponse::from)
                .collect(Collectors.toList());
    }

    public List<WrapResponse> findAllWrap() {
        return wrapRepository.findAll().stream()
                .map(WrapResponse::from)
                .collect(Collectors.toList());
    }

    public List<DecoResponse> findAllDeco() {
        return decoRepository.findAll().stream()
                .map(DecoResponse::from)
                .collect(Collectors.toList());
    }

    public List<BouquetResponse> findBouquet(Long userSeq) {
        return bouquetRepository.findAllByUser_UserSeq(userSeq).stream()
                .map(BouquetResponse::from)
                .collect(Collectors.toList());
    }

    public BouquetResponse findBouquetDetail(Long bouquetSeq) {
        return BouquetResponse.from(findBouquetDetailByBouquetSeq(bouquetSeq));
    }

    private Bouquet findBouquetDetailByBouquetSeq(Long bouquetSeq) {
        return bouquetRepository.findByBouquetSeq(bouquetSeq)
                .orElseThrow(() -> new BloomBloomNotFoundException(String.format("해당 꽃다발이 존재하지 않습니다. ID : %d", bouquetSeq)));
    }
}