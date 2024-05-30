import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

function Contributors() {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const response = await axios.get(
          'https://api.github.com/repos/MAVRICK-1/e-commerce_website/contributors'
        );
        setContributors(response.data);
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    }

    fetchContributors();
  }, []);

  return (
    <div className="contributor-container">
      <h1 className="contributor-text">Our Contributors</h1>
      <Grid className="container-grid">
        {contributors.map((contributor) => (
          <Grid item key={contributor.id}>
            <Card className="card">
              <a
                href={contributor.html_url}
                className="cardLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CardMedia
                  component="img"
                  image={contributor.avatar_url}
                  alt={contributor.login}
                  className="img"
                />
              </a>
              <CardContent>
                <Typography className="card-name" variant="h4">
                  {contributor.login}
                </Typography>
              </CardContent>
              <CardContent className="card-bottom">
                <Typography className="text-color">
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-color"
                  >
                    View Git Profile
                  </a>
                  <span className="temp"> | </span>
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-color"
                  >
                    Contributions: {contributor.contributions}
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

export default Contributors;
