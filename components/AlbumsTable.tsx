import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useAlbums } from "services/useAlbums";

const AlbumsTable: React.FC = () => {
  const { data, isLoading, error } = useAlbums();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error fetching data. Please try again.
      </Typography>
    );
  }

  return (
    <div>
      {/* <div>{style}</div> */}
      <TableContainer component={Paper}>
        <Table aria-label="albums table">
          <TableHead>
            <TableRow>
              <TableCell>Release Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell># Want</TableCell>
              <TableCell># Have</TableCell>
              <TableCell>Rare Price</TableCell>
              <TableCell>Style</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((album) => (
              <TableRow key={album.id}>
                <TableCell>{album.releaseId}</TableCell>
                <TableCell>
                  {album.name}
                  {/* <NamePopper
                      name={album.name}
                      discogsURL={`https://www.discogs.com/${album.name}/release/${album.releaseId}`}
                      youtubeURL={`https://www.youtube.com/results?search_query=${album.name}`}
                    /> */}
                </TableCell>
                <TableCell>{album.want}</TableCell>
                <TableCell>{album.have}</TableCell>
                <TableCell>${Math.round(album.price / 100)}</TableCell>
                <TableCell>{album.style}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AlbumsTable;
