import React from "react";

export function renderTableStyle(colList) {
  colList.map((column, idx) => {
    if (column.title === "Image") {
      colList[idx] = {
        ...column,
        render: (rowData) => (
          <a href={`https://www.amazon.com/dp/${rowData.ASIN}`} target="_blank">
            <img
              src={rowData.imageUrl}
              style={{
                width: rowData.imageWidth,
                height: rowData.imageHeight,
              }}
              alt={rowData["Product Name"]}
            />
          </a>
        ),
      };
    }

    if (column.title === "Availible Units") {
      colList[idx] = {
        ...column,
        render: (rowData) =>
          rowData["Availible Units"] === 0 ? (
            <tr style={{ color: "red", position: "relative" }}>
              {rowData["Availible Units"]}
            </tr>
          ) : (
            <tr style={{ color: "black", position: "relative" }}>
              {rowData["Availible Units"]}
            </tr>
          ),
      };
    }
  });
  return colList;
}
