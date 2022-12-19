import React from "react"
import PropTypes from "prop-types"

const Post = ({ title, body }) => {
    return (
        <>
            <div>
                <div className="mb-5">
                    <h1>{title}</h1>
                </div>
                <div
                    className="tsa-white-space"
                    dangerouslySetInnerHTML={{ __html: body }}
                />
            </div>
        </>
    )
}

Post.propTypes = {
    title: PropTypes.string,
    body: PropTypes.string
}

export default Post
