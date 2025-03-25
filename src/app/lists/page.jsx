"use client";
import { Context } from "@/context/Context";
import Slider from "@/components/Slider";
import { ListsResults } from "@/components/ListsResults";
import { database, ID_TOKEN_COOKIE_NAME, usersCollectionName, VERIFY_TOKEN_ROUTE } from "@/firebase/firebase.config";
import { useContext, useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import getCookie from "@/helpers/getCookie";
import Notification from "@/components/common/Notification";
import DefaultLayout from "@/components/layout/DefaultLayout";
export default function Lists() {
  const { listActive, setListActive, firebaseActiveUser, listChanged, setCheckedMedia, edit, setEdit } = useContext(Context);
  const [currentListData, setCurrentListData] = useState(null);
  const [listSelectedChange, setListSelectedChange] = useState(false);
  const [message, setMessage] = useState({ message: "", severity: "info", open: false });
  const buttonRef = useRef();
  const buttonRef2 = useRef();

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
          setListSelectedChange(!listSelectedChange); //when selecting a new list: "favorites to watchlist" or vice versa this will trigger the dropdown to its default state
        });

        // return 'unsub' on component unmount to avoid being "subscribe" while not on this page
        return () => {
          unsub();
        };
      }
    }

    try {
      getData();
    } catch (error) {}
  }, [firebaseActiveUser?.uid, listActive, listChanged]);

  const defaultListButtons = ["favorites", "watchlist"];
  return (
    <DefaultLayout>
      <div className="lists max-sm:h-[80vh] sm:h-screen sm:min-h-screen overflow-hidden">
        <Slider>
          {defaultListButtons &&
            defaultListButtons.map((name, index) => {
              return (
                <button
                  key={index}
                  style={truncatedTextStyle} //para que el boton no exceda de una linea y cambie el layout
                  type="button"
                  ref={buttonRef2}
                  className={` rounded-full px-5 py-1.5 lg:py-2 text-[85%] lg:text-[95%] text-white  border border-gray-200 focus:z-10  border-none  ${
                    listActive === name ? "active bg-[var(--primary)] hover:bg-[var(--primary)]" : "bg-gray-600/50 hover:bg-gray-600"
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
        <ListsResults listName={listActive} currentListData={currentListData} setCurrentListData={setCurrentListData} listSelectedChange={listSelectedChange} />

        <Notification message={message} setMessage={setMessage} />
      </div>
    </DefaultLayout>
  );
}
