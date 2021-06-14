const mapList = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const playlistMap = ({
  id,
  name,
  username
}) => ({
  id,
  name,
  username
})

module.exports = { mapList, playlistMap };
