"use client";
import { Context } from "@/context/Context";
import Slider from "@/components/Slider";
import { ListsResults } from "@/components/ListsResults";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchMyData, getFieldsFromCollection } from "@/firebase/fetchMyData";
import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { Snackbar, Alert } from "@mui/material";
export default function Lists() {
  const { firebaseActiveUser, setCheckedMedia, listActiveAux, setListActiveAux, edit, setEdit } = useContext(Context);

  const [listsNames, setListsNames] = useState();
  const [listActive, setListActive] = useState("favorites");
  const [currentListData, setCurrentListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ active: false, text: "" });
  const buttonRef = useRef();
  const buttonRef2 = useRef();

  const truncatedTextStyle = {
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };

  useEffect(() => {
    if (buttonRef.current && buttonRef.current.classList.contains("active")) {
      buttonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
      console.log(buttonRef.current.classList);
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
    if (listActiveAux && listActiveAux !== listActive) {
      setListActive(listActiveAux);
    }
  }, []);

  useEffect(() => {
    //subscription to db to get real time changes
    if (database && usersCollectionName && firebaseActiveUser.uid) {
      const document = doc(database, usersCollectionName, firebaseActiveUser.uid);

      const unsub = onSnapshot(document, (doc) => {
        setCurrentListData(doc.data()?.[listActive]);
        setLoading(false);
      });

      // return 'unsub' on component unmount to avoid being "subscribe" while not on this page
      return () => {
        unsub();
      };
    }
  }, [firebaseActiveUser.uid, listActive]);

  useEffect(() => {
    const getListsNames = async () => {
      if (database && usersCollectionName && firebaseActiveUser.uid) {
        try {
          const listsData = await getFieldsFromCollection(firebaseActiveUser.uid);
          setListsNames(listsData);
        } catch (e) {
          setMessage({ message: "Error loading list names data, try again later", severity: "error", open: true });
        }
      }
    };
    getListsNames();
  }, [firebaseActiveUser.uid]);

  const defaultListButtons = ["favorites", "watchlist"];
  return (
    <div className="lists py-10 sm:py-20">
      <Slider sideControls>
        {defaultListButtons &&
          defaultListButtons.map((name, index) => {
            return (
              <button
                key={index}
                style={truncatedTextStyle} //para que el boton no exceda de una linea y cambie el layout
                type="button"
                ref={buttonRef2}
                className={` rounded-full px-4 py-1.5 text-[75%] sm:text-[75%] lg:text-[90%] text-white  border border-gray-200 focus:z-10  border-none  ${
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
                  setListActiveAux(name);
                  evt.target.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                {name}
              </button>
            );
          })}
        {listsNames &&
          listsNames.map(([name, obj], index) => {
            return (
              <button
                key={index}
                style={truncatedTextStyle} //para que el boton no exceda de una linea y cambie el layout
                type="button"
                ref={buttonRef}
                className={` rounded-full px-4 py-1.5 text-[75%]  lg:text-[90%] text-white  border border-gray-200 focus:z-10  border-none  ${
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
                  setListActiveAux(name);
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
        open={message.open}
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
