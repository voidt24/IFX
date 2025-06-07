"use client";
import { Context } from "@/context/Context";
import Slider from "@/components/Slider/Slider";
import { ListsResults } from "@/components/ListsResults";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { useContext, useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Notification from "@/components/common/Notification";
import DefaultLayout from "@/components/layout/DefaultLayout";
import useVerifyToken from "@/Hooks/useVerifyToken";
import Wrapper from "@/components/common/Wrapper/Wrapper";

export default function Lists() {
  const { listActive, setListActive, firebaseActiveUser, listChanged, setCheckedMedia, edit, setEdit, containerMargin } = useContext(Context);
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

  useVerifyToken();

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
    <Wrapper>
      <div className="flex-col-center gap-4">
        <Slider>
          {defaultListButtons &&
            defaultListButtons.map((name, index) => {
              return (
                <button
                  key={index}
                  style={truncatedTextStyle}
                  type="button"
                  ref={buttonRef2}
                  className={`hover:scale-100 ${listActive === name ? " btn-primary " : "btn-secondary !bg-white/15 !text-content-primary"} `}
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
    </Wrapper>
  );
}
