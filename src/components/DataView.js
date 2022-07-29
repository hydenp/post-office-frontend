import React, { useEffect, useState } from "react";

import white_x from "../assets/white_x.svg";
import blue_x from "../assets/blue_x.svg";

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

  console.log(item);
  console.log("var", item.value, "editable =", editable);

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
        backgroundColor: "red",
        // backgroundColor: editable ? "#4B5C72" : "#192636",
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
        <img
          src={white_x}
          alt="X"
          hidden={!editable}
          style={{
            height: 20,
            width: 20,
            margin: 0,
          }}
        />
      </button>
    </div>
  );
};

const DataField = ({ item, handleFieldEdit }) => {
  const invalidStyle = {
    // borderColor: "yellow",
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function validateEmail(email) {
    if (item.key === "Recipient") {
      return !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
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
          ...(validateEmail(item.value) ? invalidStyle : null),
          border: "none",
          height: 35,
          width: 210,
          borderRadius: 10,
          paddingLeft: 10,
          backgroundColor: "#E8E8E8",
        }}
        value={item.value}
        onChange={(e) => handleFieldEdit(item.index, item.key, e.target.value)}
      />
    </div>
  );
};

const DataRow = ({ arrIndex, row, handleDeleteRow, handleFieldEdit }) => {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: mouseOver ? "#F6F6F6" : null,
        // backgroundColor: "red",
        borderRadius: 10,
        marginBottom: 6,
        marginTop: 6,
        borderColor: "red",
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
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
            width: 20,
            display: "flex",
            height: "100%",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleDeleteRow(arrIndex)}
        >
          <img
            hidden={!mouseOver}
            src={blue_x}
            alt="X"
            style={{
              height: 20,
              width: 20,
              margin: 0,
            }}
          />
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
          <p hidden={!headerWarning} style={{ backgroundColor: "yellow" }}>
            Please make sure all table headers are unique
          </p>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              borderCollapse: "collapse",
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
                  width: 1000,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#192636",
                }}
              >
                {Object.keys(tableHeaderVariables).map((k) => (
                  <DataHeader
                    key={k}
                    item={{ index: k, value: tableHeaderVariables[k] }}
                    handleDeleteHeaderVariable={handleDeleteHeaderVariable}
                    handleHeaderEdit={handleHeaderEdit}
                  />
                ))}
                <button onClick={handleAddHeaderVariable}>Add Variable</button>
                <div
                  style={{
                    backgroundColor: "#192636",
                    borderTopRightRadius: 20,
                  }}
                ></div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "white",
                paddingBottom: 10,
              }}
            >
              {Object.keys(tableData).map((k) => (
                <DataRow
                  key={k}
                  arrIndex={k}
                  row={tableData[k]}
                  handleFieldEdit={handleTableFieldEdit}
                  handleDeleteRow={handleDeleteRow}
                />
              ))}
            </div>
          </div>
          <div>
            <button onClick={handleAddTableRow}>add row</button>
            <button onClick={handleResetTableData}>Reset</button>
          </div>
        </div>
      ) : (
        <p>Upload a CSV above to get started!</p>
      )}
    </div>
  );
};

export default DataView;
