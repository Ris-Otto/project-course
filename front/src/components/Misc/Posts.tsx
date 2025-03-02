import { StateHandler, SubState } from "../../utilities/Types.tsx";
import { CreatePost } from "./CreatePost.tsx";
import { EditButton } from "../User/StyledProfile.tsx";
import { Button } from "react-bootstrap"
import { ImageListType, ImageType } from "npm:react-images-uploading@3.1.7";
import { getImage, getRequest, postFileRequest, postRequest } from "../../api/APITemplate.ts";
import { Post } from "../../../../api/Database/Model/Post.ts";
import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import { user } from "../../store.ts";
import { useAtom } from "jotai";
import { useAuth, useImageDimensions, useRequest } from "../../Hooks.ts";
import { FlexCol, ListWrapper, StyledListBox } from "./CustomStyles.tsx";
import { useNavigate,useSearchParams } from "react-router-dom";

import {
  GoUpload
} from "react-icons/go"
import {
  LiaPencilAltSolid,
  LiaTrashAltSolid,
} from "react-icons/lia"
import cd from "../../resources/Images-Assets/cd+cover.png";
import Grid from "./Grid.tsx";
import { Loading } from "../../utilities/Loading.tsx";

type PostsProps = {
  subState: SubState;
  updateSubState: (subState: SubState, refetch?: boolean) => void;
}

function Posts({subState, updateSubState}: PostsProps) {

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const [currentPost, setCurrentPost] = useState<Post>();

  useEffect(() => {
    if(currentPost) {
      setName(currentPost.name ? currentPost.name : "");
      setText(currentPost.text ? currentPost.text : "");
      setImages(currentPost!.Bio.Media.map(a => {
        return { data_url: getImage(a.href) };
      }))
    } else {
      setName("");
      setText("");
      setImages([]);
    }
  }, [currentPost])

  const [u] = useAtom(user);

  const posts = useRequest<Post[]>(`/artist/posts/${u.id}`);

  if(posts.isError) {
    return <div></div>
  }

  if(posts.isLoading) {
    return <div></div>
  }

  if(!posts.response) {
    return <div></div>
  }
  async function submit() {
    const data = {
      name: name,
      text: text,
    }

    const res = await postRequest<Post>("/artist/posts/publish", data);

    if(images.length > 0 && res.isSuccess()) {
      const imgs = images.map((image) => image.file);
      const imagesRes = await postFileRequest(`/artist/posts/${res.response.id}/images`, { media: imgs, time: new Date().getTime() });
      if(imagesRes.isSuccess()) {
        toast("Successfully Added!");
        updateSubState("view", true);
        return;
      }
      toast.error(imagesRes.message);
    }
    toast.error(res.message);
  }

  async function update() {
    if(!currentPost) return;
    const res = await postRequest<Post>(`/artist/posts/update/${currentPost.id}`, { text, name, published: currentPost.published });

    if(res.isSuccess()) {
      toast("Successfully updated post");
      updateSubState("view", true);
      return;
    }
    toast.error(res.message);
  }

  return (
    <>
      {subState === "add" ? (
        <>
          <EditButton onClick={() => updateSubState("view")}>Cancel</EditButton>
          <EditButton onClick={submit}>Publish</EditButton>
          <CreatePost
            images={images}
            setImages={setImages}
            name={name}
            setName={setName}
            text={text}
            setText={setText}
          />
        </>
      ) : subState === "view" ? (
        <>
          <EditButton onClick={() => updateSubState("add")}>Create new post</EditButton>
          <ListWrapper>
            <div className="row-wrap-start m-3">
            {posts.response.map((post, idx) => (
              <div style={{margin: "2%"}} key={idx}>
                <ListPost post={post} setCurrentPost={setCurrentPost} updateSubState={updateSubState} />
              </div>
            ))}
            </div>
          </ListWrapper>
        </>
      ): subState === "edit" ? (
        <>
          <EditButton onClick={() => updateSubState("view")}>Cancel</EditButton>
          <EditButton onClick={update}>Update</EditButton>
          <CreatePost
            images={images}
            setImages={setImages}
            name={name}
            setName={setName}
            text={text}
            setText={setText}
          />
        </>
      ) : null}
    </>
  )
}

type ListPostProps = {
  setCurrentPost: StateHandler<Post>
} & PostPageProps
  & PostsProps

type PostPageProps = {
  post: Post
}

function ListPost({ post, subState, updateSubState, setCurrentPost }: ListPostProps) {
  const { dimensions, handleImageLoad } = useImageDimensions(globalThis.innerHeight / 4);
  const p = useMemo(() => dimensions.width * 0.12, [dimensions]);
  const postPath = useMemo(() => post.ArtistId ?
    `/artists/public/posts?artistId=${post.ArtistId}&postId=${post.id}` :
    `/venues/public/posts?venueId=${post.ArtistId}&postId=${post.id}`, [post]);
  const navigate = useNavigate();
  return (
    <StyledListBox
      minwidth={`${dimensions.width}px`}
      padding={String(p)}
    >
      <div style={{ textAlign: "right" }}>
        {!post.published ? (
          <Button onClick={() => {}}>
            <GoUpload size={20}/>
          </Button>
        ): null }
        <Button
          onClick={() => {
            setCurrentPost(post);
            updateSubState("edit");
          }}
        >
          <LiaPencilAltSolid size={30} />
        </Button>
        <Button>
          <LiaTrashAltSolid size={30} />
        </Button>
      </div>
      <div className="silly-column-sb" style={{ marginTop: "5%" }} >
        <div onClick={() => navigate(postPath)} style={{cursor: "pointer"}}>
          <PostImage name={post.name} href={post.Bio.Media[0]?.href} handleImageLoad={handleImageLoad} dimensions={dimensions} showName={!!post.name} />
        </div>
        <div
          className="description mt-3 mb-3"
          style={{ maxWidth: `${dimensions.width}px` }}
        >
          {post.text}
        </div>
      </div>
    </StyledListBox>
  )
}

function PostImage({href, handleImageLoad, dimensions, name, showName}: { href: string }) {

  return (
    <div className="picture">
      {showName ? (<h4 className="picture-name">{name}</h4>) : null}
      <img
        onLoad={handleImageLoad}
        onChange={handleImageLoad}
        style={{
         borderRadius: "10px",
         width: `${dimensions.width}px`,
         height: `${dimensions.height}px`,
        }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = cd;
        }}
        src={getImage(href)} alt={href}
      />
    </div>
  )
}

function PostPageImage({href, name, showName}) {
  const { dimensions, handleImageLoad } = useImageDimensions(globalThis.innerHeight / 4);
  return (
    <div className="picture">
      {showName ? (<h4 className="picture-name">{name}</h4>) : null}
      <img
        onLoad={handleImageLoad}
        onChange={handleImageLoad}
        style={{
          borderRadius: "10px",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = cd;
        }}
        src={getImage(href)} alt={href}
      />
    </div>
  )
}

function PostPage() {
  useAuth(-1);
  const [sp] = useSearchParams();
  const post = useRequest<Post>(`artist/posts/${sp.get("artistId")}/${sp.get("postId")}`);

  if (!post.response) return <div>Error</div>;

  if (post.isLoading) return <Loading />;

  if (post.isError)
    return <div style={{ marginTop: "60px" }}>{post.isError}</div>;
  return (
    <Grid header={post.response.name ? post.response.name : "Post"}>
      <FlexCol>
        {post.response.text}
      </FlexCol>
      <FlexCol>
        {post.response.Bio.Media.map((m, idx) =>
          <div style={{margin: "2%"}}>
            <PostPageImage href={m.href} key={idx} />
          </div>
        )}
      </FlexCol>
    </Grid>
  )
}

export { Posts, PostPage };