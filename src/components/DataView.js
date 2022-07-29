import React, { useEffect } from "react";

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
    <td key={item.index}>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          type="text"
          readOnly={!editable}
          value={item.value}
          onChange={(e) => handleHeaderEdit(item.index, e.target.value)}
        />
        <button
          onClick={() => handleDeleteHeaderVariable(item.index)}
          hidden={editable}
        >
          X
        </button>
      </div>
    </td>
  );
};

const DataField = ({ item, handleFieldEdit }) => {
  const invalidStyle = {
    borderColor: "yellow",
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
    <td key={item.key}>
      <input
        type="text"
        style={validateEmail(item.value) ? invalidStyle : {}}
        value={item.value}
        onChange={(e) => handleFieldEdit(item.index, item.key, e.target.value)}
      />
    </td>
  );
};

const DataRow = ({ arrIndex, row, handleDeleteRow, handleFieldEdit }) => {
  return (
    <tr>
      {Object.keys(row).map((k) => (
        <DataField
          key={k}
          item={{ index: arrIndex, key: k, value: row[k] }}
          handleFieldEdit={handleFieldEdit}
        />
      ))}
      <td>
        <button onClick={() => handleDeleteRow(arrIndex)}>delete</button>
      </td>
    </tr>
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
          <table>
            <thead>
              <tr>
                {Object.keys(tableHeaderVariables).map((k) => (
                  <DataHeader
                    key={k}
                    item={{ index: k, value: tableHeaderVariables[k] }}
                    handleDeleteHeaderVariable={handleDeleteHeaderVariable}
                    handleHeaderEdit={handleHeaderEdit}
                  />
                ))}
                <th>
                  <button onClick={handleAddHeaderVariable}>
                    Add Variable
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData).map((k) => (
                <DataRow
                  key={k}
                  arrIndex={k}
                  row={tableData[k]}
                  handleFieldEdit={handleTableFieldEdit}
                  handleDeleteRow={handleDeleteRow}
                />
              ))}
            </tbody>
          </table>
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
