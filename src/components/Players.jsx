import axios from "axios";
import { useEffect, useState } from "react";
export const Players = () => {
  const [data, setData] = useState();
  useEffect(() => {
    axios.get("https://api.npoint.io/20c1afef1661881ddc9c").then(({ data }) => {
      // console.log("data", data.playerList);
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
  return (
    <>
      <div>
        {sortedData?.map((e, i) => {
          return (
            <>
              <img src={images[`${e.Id}.jpg`]} alt={e.PFName} />
              <h3>{e.PFName}</h3>
              <h4>Skills: {e.SkillDesc}</h4>
              <h4>Value: ${e.Value}</h4>
              <h4>
                Upcoming Match : {e.UpComingMatchesList[0].CCode} vs{" "}
                {e.UpComingMatchesList[0].VsCCode}
              </h4>
              <h4>Next Match Time(UTC) : {e.UpComingMatchesList[0].MDate}</h4>
            </>
          );
        })}
      </div>
    </>
  );
};
