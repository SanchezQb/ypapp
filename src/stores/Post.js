import { observable } from 'mobx'

class Post {
    @observable imageToOpen = null
    @observable isOpen = false

    openModal(image) {
        this.imageToOpen = image
        this.isOpen = true
    }
    close() {
        this.isOpen = false
    }
}


const postStore = new Post()
export default postStore