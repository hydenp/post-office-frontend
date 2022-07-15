import React from "react";

const ResponseView = ({ response }) => {
  return (
    <div>
      {(() => {
        if (response.data.status === "success") {
          return response.data.body.results.map((res) => (
            <li key={res.recipient}>
              {res.recipient} - {res.status}
            </li>
          ));
        } else {
          return <p>Bad Token! Please try Signing In again!</p>;
        }
      })()}
    </div>
  );
};

export default ResponseView;
