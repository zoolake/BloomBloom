import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import FlowerImgList from "../components/main/FlowerImgList";
import BouquetDetailModal from "../components/modal/BouquetDetailModal";

function MadeList() {
  //test용 dummy data
  const bouquetList = [
    { bouquetSeq: 1, bouquetImage: "/img/bouquet1.png" },
    { bouquetSeq: 2, bouquetImage: "/img/bouquet2.png" },
    { bouquetSeq: 3, bouquetImage: "/img/bouquet3.png" },
    { bouquetSeq: 4, bouquetImage: "/img/bouquet1.png" },
    { bouquetSeq: 5, bouquetImage: "/img/bouquet2.png" },
    { bouquetSeq: 6, bouquetImage: "/img/bouquet3.png" },
    { bouquetSeq: 7, bouquetImage: "/img/bouquet1.png" },
    { bouquetSeq: 8, bouquetImage: "/img/bouquet2.png" },
    { bouquetSeq: 9, bouquetImage: "/img/bouquet3.png" },
    { bouquetSeq: 10, bouquetImage: "/img/bouquet1.png" },
    { bouquetSeq: 11, bouquetImage: "/img/bouquet2.png" },
    { bouquetSeq: 12, bouquetImage: "/img/bouquet3.png" },
    { bouquetSeq: 13, bouquetImage: "/img/bouquet1.png" },
    { bouquetSeq: 14, bouquetImage: "/img/bouquet2.png" },
    { bouquetSeq: 15, bouquetImage: "/img/bouquet3.png" },
    { bouquetSeq: 16, bouquetImage: "/img/bouquet1.png" },
    { bouquetSeq: 17, bouquetImage: "/img/bouquet2.png" },
    { bouquetSeq: 18, bouquetImage: "/img/bouquet3.png" },
  ];

  //api 연동후 data set
  // const [imgList, setImgList] = useState<Array<{}>>([]);

  return (
    <Box
      sx={{
        mx: "auto",
        width: 420,
        position: "relative",
        backgroundColor: "#FFFAFA",
        height: "840px",
        minHeight: "100vh",
      }}
    >
      <Header page="madelist"></Header>
      <BouquetDetailModal></BouquetDetailModal>
      <Typography
        sx={{
          ...textStyle,
        }}
      >
        최근 제작한 꽃다발
      </Typography>

      <Box
        sx={{
          position: "absolute",
          backgroundColor: "#FFE0E0",
          width: "410px",
          height: "710px",
          top: "140px",
          borderRadius: "10px",
          overflowX: "hidden",
          overflowY: "scroll",
        }}
      >
        <FlowerImgList
          bouquetList={bouquetList}
          top="15px"
          page="madelist"
        ></FlowerImgList>
      </Box>
    </Box>
  );
}

export const textStyle = {
  position: "absolute",
  fontFamily: "Julius Sans One",
  fontStyle: "normal",
  fontWeight: "bold",
  fontSize: "15px",
  lineHeight: "17px",
  top: "110px",
  left: "18px",
  color: "rgba(0, 0, 0, 0.8)",
};
export default MadeList;
