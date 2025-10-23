"use client";
import { useEffect, useState } from "react";
import { IhistoryMedia } from "@/Types";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import useVerifyToken from "@/Hooks/useVerifyToken";
import useHideDrawers from "@/Hooks/useHideDrawers";
import ToTop from "../components/common/ToTop/ToTop";
import Wrapper from "../components/common/Wrapper/Wrapper";
import { setHistoryMedia } from "@/store/slices/historySlice";
import HistorySkeleton from "@/components/common/Skeletons/HistorySkeleton";
import HistoryGroup from "@/components/History/HistoryGroup";
const PAGE_SIZE = 10;

function History() {
  useVerifyToken();
  useHideDrawers();
  const { historyMedia } = useSelector((state: RootState) => state.history);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<unknown>();

  const dispatch = useDispatch();
  const [totalLoadedDocs, setTotalLoadedDocs] = useState(PAGE_SIZE);

  useEffect(() => {
    return () => {
      dispatch(setHistoryMedia(null));
    };
  }, []);

  async function getData() {
    if (!database || !usersCollectionName || (firebaseActiveUser != null && !firebaseActiveUser.uid)) {
      setError(true);
      return;
    }
    //subscription to db to get real time changes
    if (firebaseActiveUser != null && firebaseActiveUser.uid) {
      //TS forces to check this conition again
      const unsubscribers: (() => void)[] = [];

      const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser.uid, "history");
      const snapshot = await getDocs(activelistDocuments);
      const totalDocs = snapshot.docs.length;

      let q = query(activelistDocuments, orderBy("createdAt", "desc"), limit(PAGE_SIZE));

      if (hasMore && lastDoc) {
        q = query(activelistDocuments, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE));
      }

      const content: [string, IhistoryMedia[]][] = [];

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.docs.length <= 0) {
          dispatch(setHistoryMedia([]));
          return;
        }

        snapshot.docs.forEach(async (doc) => {
          const dateId = doc.id;

          // Listener para la subcolección "content" de cada doc
          const uid: string = firebaseActiveUser.uid || "";
          const contentRef = collection(database, usersCollectionName, uid, "history", dateId, "content");

          const contentUnsub = onSnapshot(contentRef, (contentSnapshot) => {
            const mediaItems: IhistoryMedia[] = contentSnapshot.docs.map((contentDoc) => contentDoc.data() as IhistoryMedia);

            // Eliminamos cualquier entrada anterior para ese dateId para evitar duplicados en el UI
            const existingIndex = content.findIndex(([existingDate]) => existingDate === dateId);
            if (existingIndex !== -1) {
              content.splice(existingIndex, 1);
            }

            content.push([dateId, mediaItems]);

            let data: [string, IhistoryMedia[]][] | null;
            if (historyMedia && historyMedia?.length > 0) {
              data = [...historyMedia, ...content];
            } else {
              data = [...content];
            }
            const safeContent: [string, IhistoryMedia[]][] = data.map(([dateId, items]): [string, IhistoryMedia[]] => [dateId, items.map((item) => ({ ...item }))]);

            dispatch(setHistoryMedia(safeContent));
          });

          unsubscribers.push(contentUnsub);
        });

        setTotalLoadedDocs((prev) => prev + PAGE_SIZE);

        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        setHasMore(totalLoadedDocs < totalDocs);
      });

      return () => {
        unsubscribe();
      };
    }
  }

  useEffect(() => {
    try {
      getData();
    } catch (error) {}
  }, [firebaseActiveUser?.uid]);

  return (
    <Wrapper customClasses="relative mt-[300px] rounded-lg min-w-full">
      <h1 className="title-style">History</h1>
      <div className="flex-col-center gap-8 min-w-full ">
        {historyMedia === null ? (
          error ? (
            <p>Error loading history</p>
          ) : (
            <HistorySkeleton />
          )
        ) : historyMedia.length === 0 ? (
          <div className="w-full h-full mt-4 text-center text-content-third">Your history is empty...</div>
        ) : (
          <>
            {historyMedia.map((result: [string, IhistoryMedia[]], index) => (
              <HistoryGroup result={result} index={index} key={`date-${result[0]}`} />
            ))}
            {hasMore ? (
              <>
                <button
                  className="btn-primary !bg-brand-primary !text-white"
                  onClick={async () => {
                    setLoadMore(true);
                    await getData();
                    setLoadMore(false);
                  }}
                  disabled={loadMore}
                >
                  {loadMore ? "Loading..." : "Load more"}
                </button>
              </>
            ) : (
              <p className="text-content-muted/60 italic text-[90%]">end of list</p>
            )}
            {historyMedia.length > 5 && <ToTop />}{" "}
          </>
        )}
      </div>
    </Wrapper>
  );
}

export default History;
