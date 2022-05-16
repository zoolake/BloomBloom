import { Box, Button, Typography, Link } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import Image from "next/image";
import React from "react";

function Storecard({ storeInfo }) {
  return (
    <Box
      sx={{
        width: 400,
        height: 210,
        mt: 3,
        backgroundColor: "#FFE0E0",
        mx: "auto",
      }}
    >
      <Box sx={{ width: 400, height: 120, mt: 1, mb: 1, display: "flex" }}>
        <Box sx={{ width: 171.86, height: 120, m: 2 }}>
          <img src="/test.png" alt="test" width={171.86} height={120}></img>
        </Box>
        <Box sx={{ width: 215, height: 120, mt: 1, ml: 1.5 }}>
          <Box
            sx={{ display: "flex", height: 35, mt: 1, alignItems: "baseline" }}
          >
            <Typography
              sx={{
                fontFamily: "OneMobileLight",
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              {storeInfo.storeName.length>6?storeInfo.storeName.slice(0,5)+"...":storeInfo.storeName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: 35,
                justifyContent: "space-between",
                ml: 0.5,
              }}
            >
              <img
                src="/img/insta.png"
                alt="insta"
                width={15}
                height={15}></img>
              <img
                src="/img/blog.png"
                alt="insta"
                width={15}
                height={15}></img>
            </Box>
          </Box>
          <Typography
            sx={{
              fontFamily: "OneMobileLight",
              fontSize: "11px",
              mt: 2.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <CallIcon sx={{ fontSize: "11px", mr: 2 }}></CallIcon>
            {storeInfo.storeContact}
          </Typography>
          <Typography
            sx={{
              fontFamily: "OneMobileLight",
              fontSize: "11px",
              mt: 0.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <LocationOnIcon sx={{ fontSize: "11px", mr: 2 }}></LocationOnIcon>
            {storeInfo.storeAddress}
          </Typography>
          <Typography
            sx={{ fontFamily: "OneMobileLight", fontSize: "11px", mt: 0.5 }}
          >
            <MapIcon sx={{ fontSize: "11px", mr: 2 }}></MapIcon>
            <Link
              href={`https://naver.me/${storeInfo.storeMapId}`}
              target="_blank"
            >
              {storeInfo.storeMapId}
            </Link>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: 420, display: "flex" }}>
        {/* 여기에 이제 받아온 데이터를 넘겨서 옮겨주면 보내주면 될 것 같습니다 */}
        <Link href="/order" sx={{ textDecoration: "none", mx: "auto" }}>
          <Button
            sx={{
              width: 156,
              height: 36,
              backgroundColor: "#FFFFFF",
              color: "#000000",
              fontFamily: "OneMobileLight",
              mt: 4,
            }}
          >
            {" "}
            주문하기{" "}
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default Storecard;
