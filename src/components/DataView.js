import React from "react";

// this is how the parsed data will be delivered from the parser
// const testData = {
//   "headers": ["email", "subject", "var_1", "var_2"],
//   "body": [
//     {
//       "id": 0,
//       "email": "skyleitz@gmail.com",
//       "subject": "Subject 1",
//       "var_1": "Monika",
//       "var_2": "59"
//     },
//     {
//       "id": 1,
//       "email": "hyden.testing@gmail.com",
//       "subject": "Subject 2",
//       "var_1": "Hyden",
//       "var_2": "22"
//     },
//   ]
// }

const DataField = ({ item, handleFieldEdit }) => {
  return (
    <td key={item.key}>
      <input
        type="text"
        defaultValue={item.value}
        onChange={(e) => handleFieldEdit(item.rowKey, item.key, e.target.value)}
      />
    </td>
  );
};

const DataRow = ({ row, handleFieldEdit }) => {
  return (
    <tr>
      {Object.keys(row)
        .filter((k) => k !== "id")
        .map((k) => (
          <DataField
            key={k}
            item={{ rowKey: row.id, key: k, value: row[k] }}
            handleFieldEdit={handleFieldEdit}
          />
        ))}
    </tr>
  );
};

const DataView = ({ tableHeaders, tableData, handleFieldEdit }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {tableHeaders !== null ? (
        <table>
          <thead>
            <tr>
              {Object.keys(tableHeaders).map((k) => (
                <th key={k}>{tableHeaders[k]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(tableData).map((k) => (
              <DataRow
                key={k}
                row={tableData[k]}
                handleFieldEdit={handleFieldEdit}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>Upload a CSV above to get started!</p>
      )}
    </div>
  );
};

export default DataView;
