import { RootState } from "@/store";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckedMedia } from "@/store/slices/listsManagementSlice";
import { Checkbox } from "@mui/material";

function EditCheckbox({ id }: { id: number }) {
  const { checkedMedia, edit } = useSelector((state: RootState) => state.listsManagement);
  const dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (!checkedMedia?.includes(event.target.id)) {
        dispatch(setCheckedMedia([...checkedMedia, event.target.id]));
      }
    } else {
      if (checkedMedia?.includes(event.target?.id)) {
        dispatch(setCheckedMedia(checkedMedia.filter((element) => element !== event.target.id)));
      }
    }
  };

  return (
    edit && (
      <div id="checkbox" className="absolute w-full h-full z-[3] top-0 right-0">
        <Checkbox
          onChange={(evt) => {
            handleChange(evt);
          }}
          inputProps={{ "aria-label": "controlled" }}
          id={id.toString()}
          sx={{
            height: "100%",
            width: "100%",
            bgcolor: "#00000000",
            borderRadius: "8px",
            color: "black",
            "&:hover": {
              bgcolor: "#00000040",
            },
            "&.Mui-checked": {
              color: "white",
              bgcolor: "#000000ad",
            },
          }}
        />
      </div>
    )
  );
}

export default EditCheckbox;
