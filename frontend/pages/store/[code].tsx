import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import Header from "../../components/common/Header";
import BouquetImg from "../../components/present/BouquetImg";
import { useRouter } from "next/router";
import { getOrderInfo } from "../../components/apis/orderApi";
import FlowerInfoList from "../../components/modal/FlowerInfoList";
function Shop() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<{
    flowerInfo: Array<{
      flowerName: string;
      flowerImage: string;
      flowerCount: number;
    }>;
    bouquetImage: string;
    orderDesc: string;
    customerName: string;
  }>();
  const [code, setCode] = useState<any>();
  const handleOrder = async (code: string) => {
    const response = await getOrderInfo(code);
    setOrderData(response.data.data);
    console.log(response.data.data);
  };

  useEffect(() => {
    if (!router.isReady) return;
    setCode(router.query.code);
  }, [router.isReady]);

  useEffect(() => {
    if (code !== "" && code !== undefined && code.length) {
      handleOrder(code);
      console.log(code);
    }
  }, [code]);

  return (
    <>
      {code && orderData ? (
        <Box
          id="img"
          sx={{
            mx: "auto",
            width: 420,
            position: "relative",
            backgroundColor: "#FFFAFA",
            height: "840px",
            minHeight: "100vh",
          }}
        >
          <Box sx={{ width: 420, backgroundColor: "#FFFAFA" }}>
            <Box sx={{ pt: "1.5rem" }}>
              <Header></Header>
            </Box>
            <Box
              sx={{
                pt: "1.5rem",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <BouquetImg bouquetImage={orderData.bouquetImage}></BouquetImg>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#ffff",
                  border: "1px solid rgba(82, 82, 82, 0.29)",
                  // borderRadius: "5px",
                  mt: "1rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    height: "30px",
                    textAlign: "center",
                    alignItems: "center",
                    // borderTopLeftRadius: "5px",
                    // borderTopRightRadius: "5px",
                    backgroundColor: "#EFDFBF",
                  }}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography sx={{ ...textStyle }}>??????</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography sx={{ ...textStyle }}>????????????</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    textAlign: "center",
                    fontSize: "14px",
                    alignItems: "center",
                    height: "fitContent",
                    padding: "1rem",
                  }}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography sx={{ fontFamily: "ONEMobileLight" }}>
                        {orderData.customerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        sx={{
                          fontFamily: "ONEMobileLight",
                        }}
                      >
                        {orderData.orderDesc}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <FlowerInfoList flowerInfoList={orderData.flowerInfo} />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  );
}

export const textStyle = {
  fontSize: "15px",
  fontWeight: "bold",
  fontFamily: "JuliusSansOne",
};
export default Shop;
