import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton, Button } from "@mui/material";
import MessageCard from "../../components/present/MessageCard";
import Header from "../../components/common/Header";
import ImgDownloadBtn from "../../components/present/ImgDownloadBtn";
import html2canvas from "html2canvas";
import BouquetImg from "../../components/present/BouquetImg";
import { useRouter } from "next/router";
import { getPresent } from "../../components/apis/bouquetApi";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

function Present() {
  //   const presentData = {
  //     bouquetImage: "/img/bouquet1.png",
  //     presentSender: "김정혁",
  //     presentDesc: `좋은 옷 있으면 생각날 때 입고
  //   좋은 음식 있으면 먹고 싶을 때 먹고
  //   좋은 음악 있으면 듣고 싶을 때 들으세요
  //   더구나 좋은 사람 있으면
  //   마음 속에 숨겨두지 말고
  //   마음껏 좋아하고 마음껏 그리워하세요`,
  //   };
  const router = useRouter();
  const [windowHeight, setWindowHeight] = useState<number>();
  const [image, setImage] = useState<string>("");
  const [code, setCode] = useState<any>([]);
  const [presentData, setPresentData] = useState<{
    bouquetImage: string;
    presentSender: string;
    presentDesc: string;
  }>({
    bouquetImage: "",
    presentSender: "",
    presentDesc: "",
  });
  const onCapture = () => {
    console.log("capture");
    html2canvas(document.getElementById("img"), {
      backgroundColor: "#FFFAFA",
      proxy: "https://bloombloom.kro.kr/api/v1/proxy",
      allowTaint: false,
    }).then((canvas) => {
      onSave(canvas.toDataURL("image/jpeg"), "present.jpeg");
    });
  };
  const onSave = (uri: string, filename: string) => {
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };
  const handlePresent = async (code: string) => {
    const response = await getPresent(code);
    console.log(response.data);
    setPresentData({ ...response.data.data });
  };
  useEffect(() => {
    if (!router.isReady) return;
    setCode(router.query.code);
  }, [router.isReady]);

  useEffect(() => {
    if (code !== "" && code !== undefined && code.length) {
      handlePresent(code);
    }
  }, [code]);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);
  return (
    <>
      {code ? (
        <Box
          sx={{
            mx: "auto",
            width: windowHeight > 480 ? 420 : "100vw",
            position: "relative",
            height: windowHeight > 480 ? 840 : "100vh",
            minHeight: "100vh",
            overflow: "hidden",
            backgroundColor: "#FFFAFA",
          }}
        >
          <Box id="img">
            <Box sx={{ pt: "2rem" }}>
              <Header></Header>
            </Box>
            <Box
              sx={{
                pt: "1rem",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "ONEMobileLight",
                  fontSize: "18px",
                  margin: "1rem 0rem 1rem 0rem",
                }}
              >
                from . {presentData.presentSender}
              </Typography>
              <Box>
                <BouquetImg
                  bouquetImage={presentData.bouquetImage}
                ></BouquetImg>
              </Box>
              <Box sx={{ width: "80%", height: "30%", mb: "1rem" }}>
                <MessageCard message={presentData.presentDesc}></MessageCard>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {/* <ImgDownloadBtn
              data-html2canvas-ignore="true"
              onCapture={onCapture}
            ></ImgDownloadBtn> */}
            <Box
              sx={{ display: "flex", width: "90%", justifyContent: "center" }}
            >
              <IconButton component="div">
                <FileDownloadOutlinedIcon
                  sx={{ fontSize: "2.5rem" }}
                ></FileDownloadOutlinedIcon>
              </IconButton>
              {/* <IconButton component="div">
                <HomeRoundedIcon sx={{ fontSize: "2.5rem" }}></HomeRoundedIcon>
              </IconButton> */}
            </Box>

            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#FFE0E0",
                color: "#000",
                fontFamily: "OneMobileLight",
                fontSize: "15px",
                borderRadius: "5",
                width: "60%",
              }}
            >
              BloomBloom 이용하러가기
            </Button>
          </Box>
        </Box>
      ) : null}
    </>
  );
}

export default Present;
