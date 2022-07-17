import React from "react";

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

const DataHeader = ({ item, handleHeaderEdit }) => {
  return (
    <td key={item.index}>
      <input
        type="text"
        value={item.value}
        onChange={(e) => handleHeaderEdit(item.index, e.target.value)}
      />
    </td>
  );
};

const DataField = ({ item, handleFieldEdit }) => {
  return (
    <td key={item.key}>
      <input
        type="text"
        value={item.value}
        onChange={(e) => handleFieldEdit(item.index, item.key, e.target.value)}
      />
    </td>
  );
};

const DataRow = ({ arrIndex, row, handleFieldEdit, handleDeleteRow }) => {
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
  tableHeaders,
  headerWarning,
  tableData,
  handleHeaderEdit,
  handleFieldEdit,
  handleAddRow,
  handleDeleteRow,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {tableHeaders !== null ? (
        <div>
          <p hidden={!headerWarning} style={{ backgroundColor: "yellow" }}>
            Please make sure all table headers are unique
          </p>
          <table>
            <thead>
              <tr>
                {Object.keys(tableHeaders).map((k) => (
                  <DataHeader
                    key={k}
                    handleHeaderEdit={handleHeaderEdit}
                    item={{ index: k, value: tableHeaders[k] }}
                  />
                ))}
                <th>
                  <button>Add Variable</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData).map((k) => (
                <DataRow
                  key={k}
                  arrIndex={k}
                  row={tableData[k]}
                  handleFieldEdit={handleFieldEdit}
                  handleDeleteRow={handleDeleteRow}
                />
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={handleAddRow}>add row</button>
          </div>
        </div>
      ) : (
        <p>Upload a CSV above to get started!</p>
      )}
    </div>
  );
};

export default DataView;
