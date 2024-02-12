import styles from "./LoaderItem.module.css";

const LoaderItem = () => {
  return (
    <div
      className="w-100 py-2 d-flex align-items-center justify-content-center"
      //   sx={{
      //     width: "100%",
      //     height: "calc(100vh - 80px)",
      //     // backgroundColor: "red",
      //     display: "flex",
      //     alignItems: "center",
      //     justifyContent: "center",
      //   }}
    >
      <span className={styles.loader}></span>
    </div>
  );
};

export default LoaderItem;
