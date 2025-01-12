import { banners } from "@/helpers/banners/banners-sources";

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Modal from "../common/Modal";
import { Context } from "@/context/Context";
import { updateField } from "@/firebase/fetchMyData";

export default function Banner({ banner, setBanner }: { banner: string; setBanner: Dispatch<SetStateAction<string>> }) {
  const [bannersModal, setBannersModal] = useState(false);
  const [bannerClicked, setBannerClicked] = useState("");
  const { firebaseActiveUser } = useContext(Context);

  useEffect(() => {
    setBannerClicked(banner);
  }, [banner]);

  useEffect(() => {
    const updateBanner = async () => {
      if (!bannersModal && bannerClicked != banner) {
        try {
          await updateField(firebaseActiveUser?.uid, "banner", bannerClicked);
          setBanner(bannerClicked);
        } catch (err) {
          setBannerClicked(banner);
        }
      }
    };
    updateBanner();
  }, [bannersModal]);

  return (
    <>
      <div className="results-container mx-auto rounded-lg shadow-lg bg-neutral-800/50 overflow-hidden !p-0 text-white xl:max-w-[1400px]">
        <div className="relative max-sm:h-40 sm:h-72 md:h-80 xl:h-[420px] overflow-hidden">
          <div className={`h-full object-contain bg-center bg-cover mx-auto `} style={{ backgroundImage: `url(${banner})` }}></div>
          {/* EDIT BANNER BUTTON */}
          <button
            className="absolute top-3 right-3 px-2 py-1 rounded-lg hover:bg-white/30 text-[140%]"
            onClick={() => {
              setBannersModal(true);
            }}
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      </div>

      {/* MODAL TO CHOOSE BANNER */}
      <Modal modalActive={bannersModal} setModalActive={setBannersModal}>
        <div className="w-full h-[85vh] flex flex-col gap-4 items-center justify-center">
          <h2 className="text-xl text-[var(--primary)]">Select a banner for your profile</h2>
          <div className="flex flex-wrap gap-6 overflow-auto items-center justify-between h-full pb-10">
            {banners.map((el, index) => {
              return (
                <button
                  type="button"
                  className={`${bannerClicked != el.src && "hover:border"} flex flex-col items-center gap-2 relative w-full`}
                  onClick={() => {
                    setBannerClicked(el.src);
                  }}
                  key={index}
                >
                  <img src={el.src} alt="" className="" />
                  <p>{el.name}</p>

                  {el.src == bannerClicked && (
                    <div className="absolute w-full h-full bg-gray-950/80 flex items-center justify-center border border-[var(--primary)]">
                      <svg className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
