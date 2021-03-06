import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import StoreCardSmall from "../components/order/StoreCardSmall";
import OrderFlower from "../components/order/OrderFlower";
import Request from "../components/order/Request";
import Header from "../components/common/Header";
import MakeButton from "../components/main/MakeButton";
import { useRouter } from "next/router";
import { OrderRequest } from "../components/apis/order";
import Swal from "sweetalert2";
export default function Order() {
  const [store, setStore] = useState<any>();
  const [bouquetSeq, setBouquetSeq] = useState<number>();
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const handleContent = (data: string) => {
    console.log(data);
    setContent(data);
  };

  useEffect(() => {
    console.log("store", store);
  }, [store]);
  useEffect(() => {
    if (router.query.storeInfo) {
      setStore(JSON.parse(String(router.query.storeInfo)));
      setBouquetSeq(Number(router.query.bouquetSeq));
      console.log(store);
    }
  }, []);

  const sendOrder = async (contact) => {
    if (store) {
      const body = {
        bouquetSeq: bouquetSeq,
        storeSeq: store.storeSeq,
        orderDesc: content,
        contact: contact,
      };
      var response = await OrderRequest(body);
    }
  };
  const sendOrderRequest = async () => {
    Swal.fire({
      title:
        "<style>.swal2-popup{font-family: OneMobileLight}  .cursor_{cursor: pointer} </style>이대로 주문 의뢰를 해드릴까요?",
      html:
        '<strong style="color:#f1bfbf;">🌼꽃집 주인</strong>분들에게 전달할 <br><b>연락처</b>를 적어주세요!<br> <p style="font-size:0.8rem; color:gray;">"-" 을 제외하고 적어주세요~</p> ' +
        "</div></b> ",
      icon: "success",
      input: "text",
      showConfirmButton: true,
      confirmButtonText: "네! 해주세요",
      showLoaderOnConfirm: true,
      preConfirm: (e) => {
        // '-' 입력 시
        var regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
        // 숫자만 입력시
        var regExp2 = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
        // 형식에 맞는 경우 true 리턴
        console.log("핸드폰번호 유효성 검사 :: ", regExp2.test(e));
        if (regExp2.test(e)) {
          sendOrder(e);
          const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2000,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: "주문의뢰 성공 🎉 <br> 메인화면으로 돌아갑니다!",
          }).then(() => {
            router.push("/main");
          });
        } else {
          Swal.showValidationMessage(`올바르지 않은 연락처입니다.`);
        }
      },
    });
  };
  return (
    <Box
      style={{
        width: "420px",
        height: "100vh",
        margin: "auto",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFAFA",
      }}
    >
      {store !== undefined ? (
        <>
          <Box
            sx={{
              height: "10vh",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Header></Header>
          </Box>
          <Box
            sx={{
              height: "25vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <StoreCardSmall storeInfo={store}></StoreCardSmall>
          </Box>

          <Box
            sx={{
              height: "30vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OrderFlower bouquetSeq={Number(bouquetSeq)}></OrderFlower>
          </Box>
          <Box
            sx={{
              height: "20vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Request handleContent={handleContent}></Request>
          </Box>
          <Box
            sx={{
              height: "10vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ mx: "auto" }}>
              <Button
                sx={{
                  width: 156,
                  height: 36,
                  backgroundColor: "#FFE0E0",
                  color: "#000000",
                  fontFamily: "OneMobileLight",
                  fontWeight: "bold",
                }}
                onClick={sendOrderRequest}
              >
                {" "}
                💸 주문의뢰하기{" "}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              height: "5vh",
            }}
          ></Box>
        </>
      ) : null}
    </Box>
  );
}
