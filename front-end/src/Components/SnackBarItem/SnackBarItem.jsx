import * as React from "react";
import { useSnackbar } from "@mui/base/useSnackbar";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { css, keyframes, styled } from "@mui/system";
import styles from "./SnackBarItem.module.css";

export default function SnackBarItem({
  snackBarConfig,
  setSnackBarConfig,
  // isOpenSnackBar,
  // setIsOpenSnackBar,
  // message,
}) {
  // const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    // setOpen(false);
    setSnackBarConfig({ ...snackBarConfig, open: false });
  };
  const { getRootProps, onClickAway } = useSnackbar({
    onClose: handleClose,
    open: snackBarConfig.open,
    autoHideDuration: 5000,
  });

  // const handleOpen = () => {
  //   // setOpen(true);
  //   setIsOpenSnackBar(true);
  // };

  return (
    <React.Fragment>
      {/* <TriggerButton type="button" onClick={handleOpen}>
        Open snackbar
      </TriggerButton> */}

      {snackBarConfig.open ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <div {...getRootProps()} className={styles.snackBar}>
            {snackBarConfig.message}
          </div>
        </ClickAwayListener>
      ) : null}
      {/* {open ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <CustomSnackbar {...getRootProps()}>Hello World</CustomSnackbar>
        </ClickAwayListener>
      ) : null} */}
    </React.Fragment>
  );
}
