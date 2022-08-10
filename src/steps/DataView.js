import React, { useEffect, useState } from "react";
import DeleteSymbol from "../components/DeleteSymbol";
import PlusSymbol from "../components/PlusSymbol";
import { colors } from "../assets/colors";

const DataHeader = ({ item, deleteHeaderVariable, headerEdit }) => {
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
        backgroundColor: editable ? "#4B5C72" : colors.PRIMARY,
      }}
    >
      <input
        type="text"
        readOnly={!editable}
        value={item.value}
        onChange={(e) => headerEdit(item.index, e.target.value)}
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
        onClick={() => deleteHeaderVariable(item.index)}
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

  function validateEmail(dataFieldValue) {
    if (item.key === "Recipient") {
      return !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        dataFieldValue
      );
    } else {
      return dataFieldValue === "";
    }
  }

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
  headerVariables,
  row,
  deleteRow,
  handleFieldEdit,
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        width: "fit-content",
        backgroundColor: mouseOver ? colors.BACKGROUND : null,
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
      {headerVariables.map((v) => (
        <DataField
          key={v}
          item={{ index: arrIndex, key: v, value: row[v] }}
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
          onClick={() => deleteRow(arrIndex)}
          disabled={!mouseOver || dataLength < 2}
        >
          <DeleteSymbol
            dimension={20}
            color={colors.PRIMARY}
            hidden={!mouseOver}
          />
        </button>
      </div>
    </div>
  );
};

const DataView = ({
  // data props
  bodyInput,
  headerWarning,
  tableData,
  tableHeaderVariables,
  numVariablesAdded,
  // function props
  handleSetBodyInput,
  handleSetHeaderVariableWarning,
  handleSetTableHeaderVariables,
  handleSetTableData,
  handleSetNumVariablesAdded,
  handleSetValidEmailsUpdate,
}) => {
  const [mouseOverAddVarButton, setMouseOverAddVarButton] = useState(false);
  const [mouseOverAddRowButton, setMouseOverAddRowButton] = useState(false);
  const [mouseOverClearData, setMouseOverClearData] = useState(false);

  // Table CRUD Functions

  function addHeaderVariable() {
    let newVarName = `new_variable_${numVariablesAdded + 1}`;
    if (tableHeaderVariables.includes(newVarName)) {
      Math.random();
      newVarName = `new_variable_${Math.random() ** 10}`;
    }
    handleSetNumVariablesAdded(numVariablesAdded + 1);

    // update the headers state variable
    const newHeaderVariables = [...tableHeaderVariables];
    newHeaderVariables.push(newVarName);
    handleSetTableHeaderVariables(newHeaderVariables);

    // update the tableData with the new key in every row
    const updatedTableData = [];
    for (const row in tableData) {
      const updatedRow = { ...tableData[row] };
      updatedRow[newVarName] = "";
      updatedTableData.push(updatedRow);
    }
    handleSetTableData(updatedTableData);
  }

  function addTableRow() {
    // create an object with all the keys mapped to empty strings
    const newRow = {};
    for (const header in tableHeaderVariables) {
      newRow[tableHeaderVariables[header]] = "";
    }

    // create the shallow copy and set the state variable to the shallow copy
    const newTableData = [...tableData];
    newTableData.push(newRow);
    handleSetTableData(newTableData);
  }

  function deleteRow(arrIndex) {
    const newTableData = [...tableData];
    newTableData.splice(arrIndex, 1);
    handleSetTableData(newTableData);
  }

  function deleteHeaderVariable(variableIndex) {
    const variableName = tableHeaderVariables[variableIndex];
    // update headers
    const updatedHeaderVariables = [...tableHeaderVariables];
    updatedHeaderVariables.splice(variableIndex, 1);
    handleSetTableHeaderVariables(updatedHeaderVariables);

    // update data body
    const updatedTableData = [];
    for (const rowIndex in tableData) {
      const updatedRow = { ...tableData[rowIndex] };
      delete updatedRow[variableName];
      updatedTableData.push(updatedRow);
    }
    handleSetTableData(updatedTableData);
  }

  function headerEdit(arrIndex, newValue) {
    // make sure the variable doesn't already exist
    if (tableHeaderVariables.includes(newValue)) {
      // display the warning for 3 seconds that variables must be unique
      handleSetHeaderVariableWarning(true);
      setTimeout(function () {
        handleSetHeaderVariableWarning(false);
      }, 3000);

      // if the new header variable is valid, perform updates
    } else {
      // update the header variables state
      handleSetHeaderVariableWarning(false);
      const oldValue = tableHeaderVariables[arrIndex];
      const newHeaders = [...tableHeaderVariables];
      newHeaders[arrIndex] = newValue;
      handleSetTableHeaderVariables(newHeaders);

      // update the key in the table data row objects
      const newTableData = [];
      for (const rowIndex in tableData) {
        const updatedRow = { ...tableData[rowIndex] };
        updatedRow[newValue] = updatedRow[oldValue];
        delete updatedRow[oldValue];
        newTableData.push(updatedRow);
      }
      handleSetTableData(newTableData);

      // update the bodyInput with the new key everywhere it is used
      const newBody = bodyInput.replaceAll(`{${oldValue}}`, `{${newValue}}`);
      handleSetBodyInput(newBody);
    }
  }

  function resetTableData() {
    if (
      window.confirm(
        "Are you sure you want to clear all your progress? You cannot undo this action."
      )
    ) {
      handleSetTableHeaderVariables([]);
      handleSetTableData([]);
      localStorage.removeItem("tableHeaders");
      localStorage.removeItem("tableData");
    }
  }

  // functions to be passed down

  function handleTableFieldEdit(rowIndex, key, newValue) {
    // create the new row object
    const newRow = { ...tableData[rowIndex], [key]: newValue };
    // shallow copy data and then set new row
    const newData = [...tableData];
    newData[rowIndex] = newRow;
    handleSetTableData(newData);
  }

  // HOOKS + HOOKS related

  function cacheDataToLocalStore(key, data) {
    if (data.length > 0) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  // updating the table data in user storage
  useEffect(() => {
    cacheDataToLocalStore("tableHeaders", tableHeaderVariables);
    cacheDataToLocalStore("tableData", tableData);

    if (tableData.length > 0) {
      let allValid = true;
      for (const row in tableData) {
        allValid =
          allValid &&
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
            tableData[row]["Recipient"]
          );
      }
      handleSetValidEmailsUpdate(allValid);
    }
  }, [tableHeaderVariables, tableData, handleSetValidEmailsUpdate]);

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
      handleSetTableHeaderVariables(localStorageTableHeaderVariables);
      handleSetTableData(localStorageTableData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {tableHeaderVariables.length > 0 ? (
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
                color: colors.DEACTIVATED,
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
                  backgroundColor: colors.PRIMARY,
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
                    deleteHeaderVariable={deleteHeaderVariable}
                    headerEdit={headerEdit}
                  />
                ))}
                <div
                  style={{
                    backgroundColor: colors.PRIMARY,
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
                    headerVariables={tableHeaderVariables}
                    handleFieldEdit={handleTableFieldEdit}
                    deleteRow={deleteRow}
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
                      : colors.BACKGROUND,
                  }}
                  onClick={() => addTableRow()}
                  onMouseEnter={() => setMouseOverAddRowButton(true)}
                  onMouseLeave={() => setMouseOverAddRowButton(false)}
                >
                  <PlusSymbol
                    color={colors.PRIMARY}
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
                    backgroundColor: mouseOverClearData
                      ? "#E8E8E8"
                      : colors.BACKGROUND,
                  }}
                  onClick={() => {
                    resetTableData();
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
                  backgroundColor: mouseOverAddVarButton
                    ? colors.BACKGROUND
                    : null,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => addHeaderVariable()}
                onMouseEnter={() => setMouseOverAddVarButton(true)}
                onMouseLeave={() => setMouseOverAddVarButton(false)}
              >
                <PlusSymbol color={colors.PRIMARY} dimension={30} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p
          style={{
            color: colors.DEACTIVATED,
          }}
        >
          Upload a CSV above to get started!
        </p>
      )}
    </div>
  );
};

export default DataView;
