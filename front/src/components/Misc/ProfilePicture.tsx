

function ProfilePicture({ image, dimensions, handleImageLoad}: {image: string, dimensions, handleImageLoad}) {
  return (
    <img
      src={image}
      alt={"Profile picture"}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        marginRight: "10%",
      }}
      onLoad={handleImageLoad}
    />
  )
}

export { ProfilePicture };