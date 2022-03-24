import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, H1, Img } from "./Player.styled";
export const Players = () => {
  const [data, setData] = useState();
  useEffect(() => {
    axios.get("https://api.npoint.io/20c1afef1661881ddc9c").then(({ data }) => {
      // console.log("data", data);

      setData(data);
    });
  }, []);
  //  importing all players images
  const importAll = (r) => {
    let images = {};
    r.keys().forEach((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  };
  const images = importAll(
    require.context("../player-images", false, /\.(png|jpe?g|svg)$/)
  );
  // sort in ascending order of players value
  const sortedData = data?.playerList?.sort((a, b) => {
    return +a.Value - +b.Value;
  });
  // convert utc to specific timezone example to undertand better
  // if (sortedData) {
  //   // console.log("p1:", sortedData[0]);
  //   const utc = sortedData[0]?.UpComingMatchesList[0]?.MDate;

  //   // console.log("utc:", utc);
  //   const uDate = new Date(utc).toLocaleDateString().split("/");
  //   const time = new Date(utc).toLocaleTimeString();
  //   // console.log("time:", time);
  //   let temp = uDate[0];
  //   uDate[0] = uDate[1];
  //   uDate[1] = temp;
  //   // console.log("uDate:", uDate);
  //   let newDate = uDate.join("/") + " " + time;
  //   // console.log("newDate:", newDate);
  //   let kk = new Date(newDate);
  //   let off = kk.getTimezoneOffset();
  //   console.log("off:", off);
  //   console.log("kk:", kk.getTime());
  //   // in one day there is 86400000 ms
  //   let rk = new Date(kk.getTime() + off * 1000 * -1 * 60 + 86400000);
  //   console.log("rk:", rk);
  // }

  // converting date in local date and time and saving in localTime varible

  // ***********assuming given date is dd/mm/yyy format*********
  sortedData?.forEach((e) => {
    // console.log(e.UpComingMatchesList[0].MDate);
    const utc = e.UpComingMatchesList[0].MDate;
    if (utc.length > 0) {
      // console.log("utc:", utc);
      const uDate = new Date(utc).toLocaleDateString().split("/");
      const time = new Date(utc).toLocaleTimeString();
      // console.log("time:", time);
      let temp = uDate[0];
      uDate[0] = uDate[1];
      uDate[1] = temp;
      // console.log("uDate:", uDate);
      let newDate = uDate.join("/") + " " + time;
      // console.log("newDate:", newDate);
      let correctDate = new Date(newDate);
      let off = correctDate.getTimezoneOffset();
      // console.log("off:", off);
      // console.log("correctDate:", correctDate.getTime());
      if (time === "12:00:00 AM") {
        // in one day there is 86400000 ms
        let newTime = new Date(
          correctDate.getTime() + off * 1000 * -1 * 60 + 86400000
        );
        let newTimeString = newTime.toLocaleString();

        e.localTime = newTimeString;
      } else {
        let newTime = new Date(correctDate.getTime() + off * 1000 * -1 * 60);
        let newTimeString = newTime.toLocaleString();

        e.localTime = newTimeString;
      }
    } else {
      e.localTime = 0;
    }
  });
  return (
    <>
      <H1>Players Details</H1>
      <Grid>
        {sortedData?.map((e, i) => {
          return (
            <div>
              <Img src={images[`${e.Id}.jpg`]} alt={e.PFName} />
              <h3>{e.PFName}</h3>
              <h4>Skills: {e.SkillDesc}</h4>
              <h4>Value: ${e.Value}</h4>
              <h4>
                Upcoming Match :{" "}
                {e.UpComingMatchesList[0].CCode.length === 0 ? (
                  <>No Match Scheduled</>
                ) : (
                  <>
                    {e.UpComingMatchesList[0].CCode} Vs{" "}
                    {e.UpComingMatchesList[0].VsCCode}
                  </>
                )}
              </h4>
              <h4>
                Next Match Time:{" "}
                {e.localTime === 0 ? <>No Match Scheduled </> : e.localTime}
              </h4>
            </div>
          );
        })}
      </Grid>
    </>
  );
};
