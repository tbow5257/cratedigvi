import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useAlbums } from "services/useAlbums";

interface AlbumsTableProps {
  defaultPage?: number;
  defaultSize?: number;
}

const AlbumsTable: React.FC<AlbumsTableProps> = ({
  defaultPage = 1,
  defaultSize = 20,
}) => {
  const [page, setPage] = useState(defaultPage);
  const [size, setSize] = useState(defaultSize);
  const { data, isLoading, isFetching, error } = useAlbums({ page, size });

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

  const { metadata, content } = data || {};
  const { perPage, total, hasNextPage } = metadata || {};

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const newPagePlusInitial = newPage + 1;
    setPage(newPagePlusInitial);
  };

  const handleSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value));
    setPage(1);
  };

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
            {isFetching ? (
              <>
                {Array.from({ length: size }, (_, i) => (
                  <TableRow key={`loading-row-${i}`}>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {content?.map((album) => (
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
              </>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[20, 50]}
                colSpan={6}
                count={total ?? 0}
                rowsPerPage={perPage ?? 0}
                page={page ? page - 1 : 0}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleSizeChange}
                labelRowsPerPage="Rows per page:"
                nextIconButtonProps={{
                  disabled: !hasNextPage,
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AlbumsTable;
