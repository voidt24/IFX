"use client";
import { Context } from "@/context/Context";
import Slider from "@/components/Slider";
import { ListsResults } from "@/components/ListsResults";
import { database, ID_TOKEN_COOKIE_NAME, usersCollectionName, VERIFY_TOKEN_ROUTE } from "@/firebase/firebase.config";
import { useContext, useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import { Snackbar, Alert } from "@mui/material";
import getCookie from "@/helpers/getCookie";
export default function Lists() {
  const { listActive, setListActive, firebaseActiveUser, setCheckedMedia, edit, setEdit } = useContext(Context);
  const [currentListData, setCurrentListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ active: false, text: "" });
  const buttonRef = useRef();
  const buttonRef2 = useRef();
  const [loader, setLoader] = useState(true);

  const truncatedTextStyle = {
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };

  useEffect(() => {
    async function verifyToken() {
      const authCookie = getCookie(ID_TOKEN_COOKIE_NAME);

      if (!authCookie) {
        router.push("/");
        return;
      }

      const verify = await fetch(VERIFY_TOKEN_ROUTE, {
        method: "POST",
        body: JSON.stringify({ token: authCookie }),
      });

      if (!verify.ok) {
        router.push("/");
      }
    }
    try {
      verifyToken();
    } catch (e) {
      router.push("/");
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    if (buttonRef.current && buttonRef.current.classList.contains("active")) {
      buttonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
    if (buttonRef2.current && buttonRef2.current.classList.contains("active")) {
      buttonRef2.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [buttonRef.current, buttonRef2.current]);

  useEffect(() => {
    async function getData() {
      //subscription to db to get real time changes
      if (database && usersCollectionName && firebaseActiveUser?.uid) {
        const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser.uid, listActive);

        const unsub = onSnapshot(activelistDocuments, (document) => {
          const data = [];
          document.forEach((doc) => {
            data.push(doc.data());
          });
          setCurrentListData(data);
        });

        // return 'unsub' on component unmount to avoid being "subscribe" while not on this page
        return () => {
          unsub();
        };
      }
    }

    try {
      getData();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [firebaseActiveUser?.uid, listActive]);

  const defaultListButtons = ["favorites", "watchlist"];
  return (
    <div className="lists py-10 sm:py-20 ">
      <Slider sideControls>
        {defaultListButtons &&
          defaultListButtons.map((name, index) => {
            return (
              <button
                key={index}
                style={truncatedTextStyle} //para que el boton no exceda de una linea y cambie el layout
                type="button"
                ref={buttonRef2}
                className={` rounded-full px-4 py-1 text-[70%] lg:text-[90%] text-white  border border-gray-200 focus:z-10  border-none  ${
                  listActive === name ? "active bg-[var(--primary)] hover:bg-[var(--primary)]" : "bg-gray-600/50 hover:bg-gray-600/50"
                } `}
                onClick={(evt) => {
                  if (edit && listActive != name) {
                    setEdit(false);
                    document.querySelectorAll(".card").forEach((card) => {
                      card.style.border = "3px solid transparent";
                      card.querySelector("img").style.filter = "none";
                      card.querySelector("img").style.transform = "scale(1)";
                    });
                    setCheckedMedia([]);
                  }
                  setListActive(name);
                  evt.target.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                {name}
              </button>
            );
          })}
      </Slider>

      {loading ? (
        <CircularProgress color="inherit" size={100} />
      ) : (
        <>
          <ListsResults listName={listActive} savedElementResults={currentListData} />
        </>
      )}

      <Snackbar
        open={message?.open}
        autoHideDuration={3500}
        onClose={() => {
          setMessage({ ...message, open: false });
        }}
      >
        <Alert
          onClose={() => {
            setMessage({ ...message, open: false });
          }}
          severity={message.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
