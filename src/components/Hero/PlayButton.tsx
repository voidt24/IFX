"use client";
import Link from "next/link";
import { IMediaData } from "@/Types";

function PlayButton({ sliderData, type }: { sliderData: IMediaData; type: string }) {
  return (
    <Link className={`btn-primary text-[40%] !py-0 !px-8`} href={`${type.toLowerCase().split(" ").join("")}/${sliderData.id}/watch?option=1`}>
      <span>
        <i className="bi bi-play-fill mr-1"></i> Play
      </span>
    </Link>
  );
}

export default PlayButton;
