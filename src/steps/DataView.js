import React, { useEffect, useState } from "react";
import DeleteSymbol from "../components/DeleteSymbol";
import PlusSymbol from "../components/PlusSymbol";
import PrimaryButton from "../components/PrimaryButton";

// this is how the parsed data will be delivered from the parser
// const testData = {
//   "headers": ["email", "subject", "var_1", "var_2"],
//   "body": [
//     {
//       "email": "skyleitz@gmail.com",
//       "subject": "Subject 1",
//       "var_1": "Monika",
//       "var_2": "59"
//     },
//     {
//       "email": "hyden.testing@gmail.com",
//       "subject": "Subject 2",
//       "var_1": "Hyden",
//       "var_2": "22"
//     },
//   ]
// }

const DataHeader = ({ item, handleDeleteHeaderVariable, handleHeaderEdit }) => {
  const editable = !(item.value === "Recipient" || item.value === "Subject");

  return (
    <div
      key={item.index}
      style={{
        height: 40,
        width: 220,
        borderRadius: 10,
        margin: 10,
        display: "flex",
        alignItems: "center",
        borderStyle: "none",
        backgroundColor: editable ? "#4B5C72" : "#192636",
      }}
    >
      <input
        type="text"
        readOnly={!editable}
        value={item.value}
        onChange={(e) => handleHeaderEdit(item.index, e.target.value)}
        style={{
          height: 35,
          width: 180,
          borderRadius: 10,
          paddingLeft: 10,
          fontSize: 16,
          color: "white",
          border: "none",
          backgroundColor: "transparent",
        }}
        className="custom-field"
      />
      <button
        style={{
          all: "unset",
          background: "none",
          marginRight: 10,
          width: 20,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => handleDeleteHeaderVariable(item.index)}
        hidden={editable}
      >
        <DeleteSymbol dimension={20} color={"white"} hidden={!editable} />
      </button>
    </div>
  );
};

const DataField = ({ item, handleFieldEdit }) => {
  const invalidStyle = {
    borderColor: "rgba(205, 00, 00)",
    backgroundColor: "white",
    borderWidth: 2,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function validateEmail(dataFieldValue) {
    if (item.key === "Recipient") {
      return !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        dataFieldValue
      );
    } else {
      return dataFieldValue === "";
    }
  }

  useEffect(() => {
    validateEmail(item.value);
  }, [item.value, validateEmail]);

  return (
    <div
      style={{
        borderColor: "white",
        margin: 10,
        width: 220,
      }}
      key={item.key}
    >
      <input
        type="text"
        style={{
          ...(validateEmail(item.value)
            ? invalidStyle
            : {
                borderWidth: 2,
                borderColor: "#E8E8E8",
              }),
          height: 35,
          width: 210,
          borderRadius: 10,
          borderStyle: "solid",
          paddingLeft: 10,
          backgroundColor: "#E8E8E8",
        }}
        value={item.value}
        onChange={(e) => handleFieldEdit(item.index, item.key, e.target.value)}
      />
    </div>
  );
};

const DataRow = ({
  arrIndex,
  dataLength,
  row,
  handleDeleteRow,
  handleFieldEdit,
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        width: "fit-content",
        backgroundColor: mouseOver ? "#F6F6F6" : null,
        borderRadius: 10,
        marginTop: 6,
        marginLeft: 25,
        borderColor: "red",
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 35,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        {parseInt(arrIndex) + 1}.
      </p>
      {Object.keys(row).map((k) => (
        <DataField
          key={k}
          item={{ index: arrIndex, key: k, value: row[k] }}
          handleFieldEdit={handleFieldEdit}
        />
      ))}
      <div>
        <button
          style={{
            all: "unset",
            background: "none",
            marginRight: 10,
            marginLeft: 5,
            width: 25,
            display: dataLength > 1 ? "flex" : "none",
            height: "100%",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleDeleteRow(arrIndex)}
          disabled={!mouseOver || dataLength < 2}
        >
          <DeleteSymbol dimension={20} color={"#192636"} hidden={!mouseOver} />
        </button>
      </div>
    </div>
  );
};

const DataView = ({
  // data props
  headerWarning,
  tableData,
  tableHeaderVariables,
  // function props
  handleAddHeaderVariable,
  handleAddTableRow,
  handleDeleteHeaderVariable,
  handleDeleteRow,
  handleHeaderEdit,
  handleResetTableData,
  handleSetTableDataFromLocalStorage,
  handleTableFieldEdit,
  handleValidEmailsUpdate,
}) => {
  const [mouseOverAddVarButton, setMouseOverAddVarButton] = useState(false);
  const [mouseOverAddRowButton, setMouseOverAddRowButton] = useState(false);
  const [mouseOverClearData, setMouseOverClearData] = useState(false);

  function cacheDataToLocalStore(key, data) {
    if (data !== null && data !== {}) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  // updating the table data in user storage
  useEffect(() => {
    cacheDataToLocalStore("tableHeaders", tableHeaderVariables);
    cacheDataToLocalStore("tableData", tableData);

    if (tableData !== null) {
      if (tableData.length > 0) {
        let allValid = true;
        for (const row in tableData) {
          allValid =
            allValid &&
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
              tableData[row]["Recipient"]
            );
        }
        handleValidEmailsUpdate(allValid);
      }
    }
  }, [tableHeaderVariables, tableData, handleValidEmailsUpdate]);

  // fetching the table data from local_storage on load
  useEffect(() => {
    const localStorageTableData = JSON.parse(localStorage.getItem("tableData"));
    const localStorageTableHeaderVariables = JSON.parse(
      localStorage.getItem("tableHeaders")
    );
    if (
      localStorageTableData !== null &&
      localStorageTableHeaderVariables !== null
    ) {
      handleSetTableDataFromLocalStorage(
        localStorageTableHeaderVariables,
        localStorageTableData
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {tableHeaderVariables !== null ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: "#676767",
                // textAlign: "left",
              }}
            >
              View and edit all of your data. Every cell must have a value in
              order to proceed.
            </p>
          </div>
          <p hidden={!headerWarning} style={{ backgroundColor: "yellow" }}>
            Please make sure all table headers are unique
          </p>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              borderCollapse: "collapse",
              paddingBottom: 10,
            }}
          >
            <div
              style={{
                height: 60,
                borderRadius: 10,
              }}
            >
              {/* table head*/}
              <div
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingLeft: 25,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#192636",
                }}
              >
                <div
                  style={{
                    width: 35,
                  }}
                ></div>
                {Object.keys(tableHeaderVariables).map((k) => (
                  <DataHeader
                    key={k}
                    item={{ index: k, value: tableHeaderVariables[k] }}
                    handleDeleteHeaderVariable={handleDeleteHeaderVariable}
                    handleHeaderEdit={handleHeaderEdit}
                  />
                ))}
                <div
                  style={{
                    backgroundColor: "#192636",
                    borderTopRightRadius: 20,
                  }}
                ></div>
              </div>
            </div>
            {/* table body */}
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  width: "fit-content",
                }}
              >
                {Object.keys(tableData).map((k) => (
                  <DataRow
                    key={k}
                    arrIndex={k}
                    dataLength={tableData.length}
                    row={tableData[k]}
                    handleFieldEdit={handleTableFieldEdit}
                    handleDeleteRow={handleDeleteRow}
                  />
                ))}
                {/* Add Row*/}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    margin: 0,
                    marginLeft: 35 + 35,
                    marginRight: 35 + 10,
                    borderRadius: 10,
                    height: 32,
                    marginTop: 6,
                    marginBottom: 6,
                    backgroundColor: mouseOverAddRowButton
                      ? "#E8E8E8"
                      : "#F6F6F6",
                  }}
                  onClick={() => handleAddTableRow()}
                  onMouseEnter={() => setMouseOverAddRowButton(true)}
                  onMouseLeave={() => setMouseOverAddRowButton(false)}
                >
                  <PlusSymbol
                    color={"#192636"}
                    dimension={15}
                    style={{
                      marginRight: 5,
                    }}
                  />
                  <p>Add Row</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    margin: 0,
                    marginLeft: 35 + 35,
                    marginRight: 35 + 10,
                    borderRadius: 10,
                    height: 32,
                    marginTop: 6,
                    marginBottom: 6,
                    backgroundColor: mouseOverClearData ? "#E8E8E8" : "#F6F6F6",
                  }}
                  onClick={() => {
                    handleResetTableData();
                    setMouseOverClearData(false);
                  }}
                  onMouseEnter={() => setMouseOverClearData(true)}
                  onMouseLeave={() => setMouseOverClearData(false)}
                >
                  <p
                    style={{
                      color: "rgba(205, 00, 00)",
                    }}
                  >
                    Clear All Values
                  </p>
                </div>
              </div>
              {/* Add Variable */}
              <div
                style={{
                  borderRadius: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 6,
                  width: 50,
                  backgroundColor: mouseOverAddVarButton ? "#F6F6F6" : null,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => handleAddHeaderVariable()}
                onMouseEnter={() => setMouseOverAddVarButton(true)}
                onMouseLeave={() => setMouseOverAddVarButton(false)}
              >
                <PlusSymbol color={"#192636"} dimension={30} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p
          style={{
            color: "#676767",
          }}
        >
          Upload a CSV above to get started!
        </p>
      )}
    </div>
  );
};

export default DataView;
