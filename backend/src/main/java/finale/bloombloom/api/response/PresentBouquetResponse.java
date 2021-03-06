package finale.bloombloom.api.response;

import finale.bloombloom.common.util.S3ImageUrlConverter;
import finale.bloombloom.db.entity.Bouquet;
import finale.bloombloom.db.entity.Present;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PresentBouquetResponse {
    private String bouquetImage;
    private String presentSender;
    private String presentDesc;

    public static PresentBouquetResponse from(Present present, Bouquet bouquet, S3ImageUrlConverter urlConverter) {
        return PresentBouquetResponse.builder()
                .bouquetImage(urlConverter.urlConvert(bouquet.getBouquetImage()))
                .presentSender(present.getPresentSender())
                .presentDesc(present.getPresentDesc())
                .build();
    }
}
