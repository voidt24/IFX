"use client";
import { useState, useContext, useEffect } from "react";
import { Context } from "../../context/Context";
import { auth, database, usersCollectionName } from "../../firebase/firebase.config";
import { doc, onSnapshot } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";

import { Tabs, TabsList, TabPanel, Tab } from "@mui/base";
import { Snackbar, Alert } from "@mui/material";
import { Panel } from "@/components/Panel";
import { fetchMyData } from "../../firebase/fetchMyData";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Profile = () => {
  const { setUserLogged, setFirebaseActiveUser, firebaseActiveUser, checkedMedia, setCheckedMedia, setUserClicked } = useContext(Context);

  const [savedFavoritesResults, setSavedFavoritesResults] = useState([]);
  const [savedWatchlistResults, setSavedWatchlistResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState({ message: null, severity: null, open: false });
  const router = useRouter();
  useEffect(() => {
    //subscription to db to get real time changes

    if (database && usersCollectionName && firebaseActiveUser.uid) {
      const document = doc(database, usersCollectionName, firebaseActiveUser.uid);

      const unsub = onSnapshot(document, (doc) => {
        setSavedFavoritesResults(doc.data.favorites);
        setSavedWatchlistResults(doc.data.watchlist);
      });

      // return 'unsub' on component unmount to avoid too many subscription to db
      return () => {
        unsub();
      };
    }
  }, [firebaseActiveUser.uid]);

  useEffect(() => {
    fetchMyData(firebaseActiveUser, "favorites", setSavedFavoritesResults, setLoading, setMessage).then(() => {
      setLoading(false);
    });
  }, [savedFavoritesResults]);

  useEffect(() => {
    fetchMyData(firebaseActiveUser, "watchlist", setSavedWatchlistResults, setLoading, setMessage).then(() => {
      setLoading(false);
    });
  }, [savedWatchlistResults]);

  return (
    <div className="profile">
      {firebaseActiveUser.email && firebaseActiveUser.uid ? (
        <>
          <p>
            Welcome <span id="user-in-profile">{firebaseActiveUser.email.split("@")[0]}</span>{" "}
          </p>
          {loading ? (
            <CircularProgress color="inherit" size={100} />
          ) : (
            <Tabs className="tabs" value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
              <div className="tablist-container z-50">
                <i
                  className="bi bi-arrow-left"
                  onClick={() => {
                    router.back();
                    window.scrollTo(0, 0);
                  }}
                ></i>
                <TabsList className="tablist">
                  <span
                    onClick={() => {
                      if (checkedMedia.length > 0) {
                        setCheckedMedia([]);
                      }
                    }}
                  >
                    <Tab className="tab">Favorites </Tab>
                  </span>
                  <span
                    onClick={() => {
                      if (checkedMedia.length > 0) {
                        setCheckedMedia([]);
                      }
                    }}
                  >
                    <Tab className="tab">Lists</Tab>
                  </span>
                  <span
                    onClick={() => {
                      if (checkedMedia.length > 0) {
                        setCheckedMedia([]);
                      }
                      fetchMyData(firebaseActiveUser, "watchlist", setSavedWatchlistResults, setLoading, setMessage).then(() => {
                        setLoading(false);
                      });
                    }}
                  >
                    <Tab className="tab">Watchlist</Tab>
                  </span>
                </TabsList>
              </div>
              <Panel value={0} panelName={"favorites"} savedElementResults={savedFavoritesResults} setLoading={setLoading} setMessage={setMessage} />
              <TabPanel
                onClick={() => {
                  if (checkedMedia.length > 0) {
                    setCheckedMedia([]);
                  }
                }}
                className="tabpanel"
                value={1}
              >
                <p>soon..</p>
              </TabPanel>
              <Panel
                onClick={() => {
                  if (checkedMedia.length > 0) {
                    setCheckedMedia([]);
                  }
                }}
                value={2}
                panelName={"watchlist"}
                savedElementResults={savedWatchlistResults}
                setLoading={setLoading}
                setMessage={setMessage}
              />
            </Tabs>
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
        </>
      ) : (
        <Link
          href=""
          onClick={() => {
            setUserClicked(true);
          }}
          className=" text-lg underline"
        >
          Sign up to create a profile!
        </Link>
      )}
    </div>
  );
};

export default Profile;
