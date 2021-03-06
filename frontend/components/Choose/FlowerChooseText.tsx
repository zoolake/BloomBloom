import React from "react";
import Link from "next/link";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Typography, IconButton, Box } from "@mui/material";
import Toast from "../common/Toast";
import { toast } from "material-react-toastify";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
interface textProps {
  totalCount: number;
}
function FlowerChooseText({ totalCount }: textProps) {
  const router = useRouter();
  const handleBtn = () => {
    if (totalCount === 0) {
      toast.error("π£κ½μ 1κ°μ΄μ μ νν΄μ£ΌμΈμ");
    } else {
      router.push("./arrange");
    }
  };
  return (
    <>
      <Toast></Toast>
      <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <Typography
          variant="h6"
          // gutterBottom
          component="div"
          textAlign="center"
          display="flex"
          justifyContent="space-around"
          width="100%"
        >
          <IconButton style={{ color: "black", marginBottom: "5px" }}>
            <Link href="/bouquet" passHref>
              <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
            </Link>
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "18px",
                fontFamily: "OneMobileLight",
              }}
            >
              κ½μ μ νν΄μ£ΌμΈμ
            </Typography>
            <Typography
              component="div"
              display="flex"
              sx={{
                fontWeight: "600",
                alignItems: "center",
                ml: "0.5rem",
                fontFamily: "OneMobileLight",
              }}
            >
              ({totalCount}/10)
            </Typography>
          </Box>
          <IconButton
            style={{ color: "black", marginBottom: "5px" }}
            onClick={handleBtn}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "OneMobileLight",
            fontWeight: "600",
            fontSize: "13px",
            color: "#6c6c6c",
          }}
        >
          κ½μ μ΅λ 10κ°κΉμ§ μ ν κ°λ₯ν©λλ€.
        </Typography>
      </Box>
    </>
  );
}

export default FlowerChooseText;
