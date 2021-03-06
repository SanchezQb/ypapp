import { observable } from 'mobx'


class Post {
    @observable commentCount = 0
    @observable imageToOpen = null
    @observable isOpen = false
    @observable commentModalIsOpen = false
    @observable postToComment = null

    openModal(image) {
        this.imageToOpen = image
        this.isOpen = true
    }
    close() {
        this.isOpen = false
    }
    openCommentModal(post) {
        this.commentModalIsOpen = true
        this.postToComment = post
    }
    closeCommentModal() {
        this.commentModalIsOpen = false
    }

    commentCounter(count) {
        console.log(count)
        this.commentCount = count
    }
}


const postStore = new Post()
export default postStore