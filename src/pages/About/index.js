import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";

function Tes() {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/MAVRICK-1/e-commerce_website/contributors"
        );
        setContributors(response.data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    }

    fetchContributors();
  }, []);

  return (
    <div className="about-container">
      <h1 className="contributor-text">Our Contributors</h1>
      <Grid className="container-grid">
        {contributors.map((contributor) => (
          <Grid  item key={contributor.id}>
            <Card className="card">
              {window.innerWidth < 580 ? (
                <a href={contributor.html_url} className="cardLink" target="_blank">
                  <CardMedia
                    component="img"
                    height="250"
                    image={contributor.avatar_url}
                    alt={contributor.login}
                    className="img"
                  />
                </a>
              ) : (
                <CardMedia
                  component="img"
                  height="250"
                  image={contributor.avatar_url}
                  alt={contributor.login}
                  className="img"
                />
              )}
              <CardContent>
                <Typography variant="h6">{contributor.login}</Typography>
              </CardContent>
              <CardContent>
                <Typography className="card-bottom">
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-color"
                  >
                    View Git Profile
                  </a>
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-color"
                  >
                    Contributions : {contributor.contributions}
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Tes;
