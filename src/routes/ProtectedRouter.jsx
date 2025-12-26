import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { clearAuth } from "../store/slices/authSlice.js";

// 로그인 안 해도 갈 수 있는 페이지 (화이트리스트)
const PUBLIC_ROUTES = ["/login"];

export default function ProtectedRouter() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // 1. Redux에 로그인이 안 되어 있다면 재발급(Refresh) 시도
      if (!isLoggedIn) {
        try {
          // 쿠키에 담긴 Refresh Token으로 Access Token 요청
          await dispatch(reissueThunk()).unwrap();
        } catch (error) {
          console.log("인증 체크 실패 (비로그인 상태):", error);
          dispatch(clearAuth()); // 토큰 만료 시 완전히 비움
        }
      }
      // 2. 재발급 시도가 끝나면(성공이든 실패든) 화면을 보여줌
      setIsAuthChecked(true);
    }
    checkAuth();
  }, [dispatch, isLoggedIn]);

  // 인증 확인 중에는 빈 화면 (혹은 스피너) 노출
  if (!isAuthChecked) {
    return null; 
  }

  const isPublicPage = PUBLIC_ROUTES.includes(location.pathname);

  // --- 로그인 여부에 따른 리다이렉션 로직 ---
  
  if (isLoggedIn) {
    // 로그인 상태에서 로그인/회원가입 페이지 접속 시 메인(/main)으로 보냄
    if (isPublicPage) {
      return <Navigate to="/main" replace />;
    }
  } else {
    // 비로그인 상태에서 퍼블릭 페이지가 아닌 곳 접속 시 로그인(/login)으로 보냄
    if (!isPublicPage) {
      return <Navigate to="/login" replace />;
    }
  }

  // 그 외에는 요청한 페이지(Outlet)를 보여줌
  return <Outlet />;
}