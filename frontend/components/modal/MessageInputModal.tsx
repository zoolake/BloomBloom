import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { Box, TextareaAutosize, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BouquetImg from "../present/BouquetImg";
import KakaoBtn from "../button/KakaoBtn";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { messageStoredState, presentBouquetState } from "../../states/states";
import { savePresent } from "../apis/bouquetApi";
import KakaoMessage from "../kakaoApi/KakaoMessage";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "material-react-toastify";
import Toast from "../../components/common/Toast";
import { useBeforeunload } from "react-beforeunload";
import {
  Button,
  Snackbar,
  IconButton,
  Alert,
  Slide,
  SlideProps,
} from "@mui/material";
import { BASE_URL } from "../apis/config";
type TransitionProps = Omit<SlideProps, "direction">;

function TransitionDown(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}
interface meesageModalProps {
  openMessageModal?: () => void;
  closeMessageModal?: () => void;
  handleMessageModal?: (state: boolean) => void;
  messageModal?: boolean;
  isStored?: boolean;
  handleIsStored?: (state: boolean) => void;
}
function MessageInputModal({
  openMessageModal,
  closeMessageModal,
  handleMessageModal,
  messageModal,
  isStored,
  handleIsStored,
}: meesageModalProps) {
  const router = useRouter();
  const imageRef = useRef(null);
  const [content, setContent] = useState<string>("");
  const [textLength, setTextLength] = useState<number>();
  const [presentBouquet, setPresentBouquet] =
    useRecoilState(presentBouquetState);
  const [uuid, setUuid] = useState<string>("");
  // const [isStored, setIsStored] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [bouquetImage, setBouquetImage] = useState<string>("");
  const [offsetHeight, setOffsetHeight] = useState<number>();
  const [messageStored, setMessageStored] = useRecoilState(messageStoredState);
  const [windowHeight, setWindowHeight] = useState<boolean>();

  const handleStoreButtonClick = async () => {
    console.log("?????????");
    // 1. requeset??? ?????????.
    const body = {
      bouquetSeq: presentBouquet.presentBouquetSeq,
      presentDesc: content,
    };
    // 2. ????????? ????????? ?????????.
    const response = await savePresent(body);
    console.log("?????????");
    // 3. ????????? ?????? ????????? uuid??? ????????????.
    setUuid(response.data.data.uuid);
    // 4. ????????? ???????????? isStored??? true??? ?????? ????????? ????????????.
    // setIsStored(true);
    handleIsStored(true);
  };

  const handleCopyButton = () => {
    setOpen(true);
  };

  const handleCloseButton = () => {
    // setIsStored(false);
    // setMessageStored(false);
    setOpen(false);
  };
  useBeforeunload((e: any) => {
    e.preventDefault;
    console.log("?????????????");
    router.push("/madelist");
  });

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseButton}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setTextLength(text.length);
    if (textLength > 150) {
      toast.error("???150????????? ?????????????????????");
    } else {
      setContent(`${text}`);
    }
    console.log(textLength);
  };
  const handleShare = async () => {
    const body = {
      bouquetSeq: presentBouquet.presentBouquetSeq,
      presentDesc: content,
    };

    const response = await savePresent(body);
    console.log(response.data.data.uuid);

    const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
    if (window.Kakao)
      try {
        window.Kakao.init(KAKAO_KEY);
      } catch (e) {}

    const linkcallback = () => {
      //??????????????? ???????????? router.back
      router.back();
    };

    //????????? ?????? ????????? ?????? ?????? ????????? ??????
    window.Kakao.Link.sendScrap({
      requestUrl: "https://bloombloom.kro.kr", // ????????? url (?????? ?????? ???????????? ???????????????.) path??? ?????? ??????????????????
      templateId: 76396, // ?????????????????? ??????
      templateArgs: {
        THUMB: "https://cdn.discordapp.com/attachments/965189975719170088/977020787519287337/thumbnail.PNG",
        RANDOM: response.data.data.uuid, // ????????? ??????
      },
      callback: linkcallback,
    });
  };
  const handleRoute = () => {
    router.back();
  };
  useEffect(() => {
    if (imageRef !== null && imageRef !== undefined) {
      if (imageRef.current !== null) {
        console.log(imageRef.current.offsetHeight);
        setOffsetHeight(imageRef.current.offsetHeight);
      }
    }
  });
  useEffect(() => {
    console.log(offsetHeight);
  }, [offsetHeight]);
  useEffect(() => {
    if (messageModal) setContent("");
  }, [messageModal]);
  useEffect(() => {
    setWindowHeight(window.innerHeight < 500);
  }, []);
  return (
    <>
      {messageModal ? (
        <Box
          className="modal"
          sx={{
            position: "absolute",
            width: "420px",
            height: "100vh",
            backgroundColor: "rgb(31 31 31 / 33%)",
            zIndex: 900,
          }}
        >
          <Toast />
          <Box
            sx={{
              mt: "15%",
              width: "90%",
              height: "80vh",
              backgroundColor: "#FFFAFA",
              zIndex: 1300,
              borderRadius: "10px",
              // border: "1px solid rgba(0, 0, 0, 0.25)",
              boxShadow: "6px 6px 4px rgba(0, 0, 0, 0.25)",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                height: "3vh",
              }}
            >
              <CloseIcon
                sx={{
                  margin: "1rem 1rem 0rem 1rem",
                  color: "",
                  "&:hover": { cursor: "pointer" },
                }}
                onClick={() => handleMessageModal(false)}
              />
            </Box>
            {messageStored ? (
              <Typography
                sx={{
                  fontSize: "15px",
                  fontFamily: "OneMobileLight",
                  fontWeight: "bold",
                  mx: "auto",
                  textAlign: "center",
                  height: "10vh",
                }}
              >
                ???????????? ??????????????????
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: "15px",
                  fontFamily: "OneMobileLight",
                  fontWeight: "bold",
                  mx: "auto",
                  textAlign: "center",
                  height: "10vh",
                }}
              >
                ???????????? ?????? <br />
                ???????????? ?????? ???????????? ???????????????
              </Typography>
            )}
            <Box
              sx={{
                width: "100%",
                height: "67vh",
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  mx: "auto",
                  width: "40vh",
                }}
              >
                <img
                  ref={imageRef}
                  id="img"
                  src={presentBouquet.presentBouquetImage}
                  alt="?????????"
                  width={"100%"}
                  height={"auto"}
                ></img>
              </Box>
              <Box
                sx={{
                  height: "27vh",
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {messageStored ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        fontFamily: "OneMobileLight",
                        textAlign: "center",
                      }}
                    >
                      ???????????? ???????????? ??????????????? ???????????????
                      <br />
                      ???????????? ?????? ???????????? ????????? ????????? ??????????????????
                    </Typography>
                    <CopyToClipboard
                      text={BASE_URL + "present/" + uuid}
                      onCopy={handleCopyButton}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          alignItems: "center",
                          mt: "5%",
                          mb: "5%",
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          backgroundColor: "#BAD7DF",
                          color: "#000",
                          fontFamily: "OneMobileLight",
                          borderRadius: "5",
                          width: 260,
                          height: 43,
                        }}
                      >
                        <Typography
                          component="div"
                          sx={{
                            width: "25%",
                            fontWeight: "600",
                            fontSize: "15px",
                            fontFamily: "OneMobileLight",
                            color: "#000",
                          }}
                        >
                          ????
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            width: "50%",
                            fontWeight: "600",
                            fontSize: "15px",
                            fontFamily: "OneMobileLight",
                            color: "#000",
                          }}
                        >
                          ????????????
                        </Typography>
                      </Button>
                    </CopyToClipboard>
                    <KakaoBtn
                      handleBtn={handleShare}
                      title="?????????????????? ????????????"
                    ></KakaoBtn>
                  </Box>
                ) : (
                  <>
                    <textarea
                      aria-label="minimum height"
                      id="content"
                      // disabled={textLength > 150}
                      value={content}
                      // minRows={}
                      // maxRows={10}
                      placeholder="???????????? ???????????????"
                      style={{
                        width: "90%",
                        height: "15vh",
                        fontSize: "0.85rem",
                        fontFamily: "OneMobileLight",
                        border: "1px solid rgba(109, 107, 107, 0.4)",
                        resize: "none",
                        padding: "1rem",
                        backgroundColor: "#EFDFBF",
                      }}
                      onChange={(event) => handleInput(event)}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "#FFE0E0",
                        color: "#000",
                        fontFamily: "OneMobileLight",
                        borderRadius: "5",
                        width: "60%",
                        height: "auto",
                        maxHeight: "50%",
                      }}
                      onClick={handleStoreButtonClick}
                    >
                      <Typography
                        component="div"
                        sx={{
                          ...btnStyleIcon,
                        }}
                      >
                        ????
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          ...btnStyleText,
                        }}
                      >
                        ????????? ?????? ?????????
                      </Typography>
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
          <Snackbar
            open={open}
            autoHideDuration={1200}
            onClose={handleCloseButton}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            TransitionComponent={TransitionDown}
          >
            <Alert
              onClose={handleCloseButton}
              severity="success"
              sx={{ width: "100%" }}
            >
              ????????? ?????????????????????. ????
            </Alert>
          </Snackbar>
        </Box>
      ) : null}
    </>
  );
}

export const btnStyleIcon = {
  height: "auto",
  width: "20%",
  fontWeight: "600",
  fontSize: "14px",
  fontFamily: "OneMobileLight",
  color: "#000",
  padding: "2%",
};
export const btnStyleText = {
  height: "auto",
  // width: "fit-content",
  fontWeight: "600",
  fontSize: "14px",
  fontFamily: "OneMobileLight",
  color: "#000",
  padding: "2%",
  textAlign: "center",
};
export default MessageInputModal;
