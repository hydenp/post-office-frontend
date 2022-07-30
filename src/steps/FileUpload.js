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

const CSVReader = ({
  tableData,
  handleDataColdStart,
  handleRemoveFile,
  handleUpload,
}) => {
  const { CSVReader } = useCSVReader();
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );
  const [zoneHover, setZoneHover] = useState(false);

  function parseDataForView(unparsedData) {
    if (unparsedData !== null) {
      let headers = unparsedData.data[0];
      // make the very first two headers "Recipient" and "Subject" respectively
      if (unparsedData.data[0].length <= 2) {
        headers = ["Recipient", "Subject"];
      } else {
        headers[0] = "Recipient";
        headers[1] = "Subject";
      }

      // parse the body portion of the uploaded data
      const parsedData = [];
      for (let i = 1; i < unparsedData.data.length; i++) {
        let parsedRow = {};
        for (let j = 0; j < headers.length; j++) {
          if (j === 0) {
            parsedRow["Recipient"] = unparsedData.data[i][j];
          } else if (j === 1) {
            parsedRow["Subject"] = unparsedData.data[i][j];
          } else {
            parsedRow[headers[j]] = unparsedData.data[i][j];
          }
        }
        parsedData.push(parsedRow);
      }
      return [headers, parsedData];
    }
  }

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {tableData === null ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: "60%",
              height: 200,
              paddingBottom: 5,
            }}
          >
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
                      "Drag and drop a CSV or click to upload"
                    )}
                  </div>
                </>
              )}
            </CSVReader>
          </div>
          <div
            style={{
              width: "40%",
              height: 205,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <p
              style={{
                alignSelf: "center",
                margin: 0,
                marginRight: 20,
              }}
            >
              OR
            </p>
            <button
              style={{
                height: "auto",
                margin: 0,
                alignSelf: "center",
                all: "unset",
                background: "none",
                cursor: "pointer",
                color: "#0066FF",
              }}
              onClick={handleDataColdStart}
            >
              Continue without uploading
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#676767",
            }}
          >
            This step is complete, you can clear your data below if you'd like
            to restart this step.
          </p>
        </div>
      )}
    </div>
  );
};

export default CSVReader;
