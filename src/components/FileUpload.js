import React, { useState } from "react";

import {
  formatFileSize,
  lightenDarkenColor,
  useCSVReader,
} from "react-papaparse";

const GREY = "#CCC";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const styles = {
  zone: {
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: GREY,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 20,
  },
  file: {
    background: "#EEE",
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  },
  size: {
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  },
  name: {
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  },
  // progressBar: {
  //   bottom: 14,
  //   width: '50%',
  //   paddingLeft: 10,
  //   paddingRight: 10,
  // },
  zoneHover: {
    borderColor: GREY_DIM,
  },
  default: {
    borderColor: GREY,
  },
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  },
};

const CSVReader = ({ handleUpload, handleRemoveFile }) => {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  function parseDataForView(unparsedData) {
    if (unparsedData !== null) {
      const headers = unparsedData.data[0];

      // parse the body portions
      const parsedData = [];
      for (let i = 1; i < unparsedData.data.length; i++) {
        let parsedRow = {};
        for (let j = 0; j < headers.length; j++) {
          parsedRow[headers[j]] = unparsedData.data[i][j];
        }
        parsedData.push(parsedRow);
      }
      return [headers, parsedData];
    }
  }

  return (
    <div
      style={{
        display: "flex",
        width: "70%",
        flexDirection: "column",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      <h2>Upload Your File</h2>

      <CSVReader
        onUploadAccepted={(results) => {
          console.log("---------------------------");
          console.log(results);
          setZoneHover(false);
          handleUpload(...parseDataForView(results));
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setZoneHover(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setZoneHover(false);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          // ProgressBar,
          getRemoveFileProps,
          Remove,
        }) => (
          <>
            <div
              {...getRootProps()}
              style={Object.assign(
                {},
                styles.zone,
                zoneHover && styles.zoneHover
              )}
            >
              {acceptedFile ? (
                <>
                  <div style={styles.file}>
                    <div style={styles.info}>
                      <span style={styles.size}>
                        {formatFileSize(acceptedFile.size)}
                      </span>
                      <span style={styles.name}>{acceptedFile.name}</span>
                    </div>
                    {/*<div style={styles.progressBar}>*/}
                    {/*  <ProgressBar/>*/}
                    {/*</div>*/}
                    <div
                      {...getRemoveFileProps()}
                      style={styles.remove}
                      onMouseOver={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                      }}
                      onMouseOut={(event) => {
                        event.preventDefault();
                        setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                      }}
                      onClick={(event) => {
                        getRemoveFileProps().onClick(event);
                        handleRemoveFile();
                      }}
                    >
                      <Remove color={removeHoverColor} />
                    </div>
                  </div>
                </>
              ) : (
                "Drop CSV file here or click to upload"
              )}
            </div>
          </>
        )}
      </CSVReader>
    </div>
  );
};

export default CSVReader;
