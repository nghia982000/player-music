const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)
const heading=$('.header h2')
const cdThumb=$('.cd_img')
const audio=$('#audio')
const playBtn=$('.btn-toggle-play')
const player=$('.player')
const progress=$('#progress')
const cd=$('.cd')
const nextBtn=$('.btn-next')
const prevBtn=$('.btn-prev')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')
const playlist=$('.playlist')
const PLAYRT_STORAGE='20CM PLAYER'
const app={
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PLAYRT_STORAGE))||{},
    songs:[
        {
            name:'Tay to',
            singer:'MCK',
            path:'./assets/music/tayto.mp3',
            image:'./assets/img/tayto.jpg'
        },
        {
            name:'Là vì em đấy',
            singer:'Green',
            path:'./assets/music/laviemday.mp3',
            image:'./assets/img/laviemday.jpg'
        },
        {
            name:'Gửi vợ tương lai',
            singer:'Long Nón Lá',
            path:'./assets/music/guivotuonglai.mp3',
            image:'./assets/img/guivotuonglai.jpg'
        },
        {
            name:'U are so sweet',
            singer:'D Empty',
            path:'./assets/music/uaresosweet.mp3',
            image:'./assets/img/uaresosweet.jpg'
        },
        {
            name:'Tay to',
            singer:'MCK',
            path:'./assets/music/tayto.mp3',
            image:'./assets/img/tayto.jpg'
        },
        {
            name:'Là vì em đấy',
            singer:'Green',
            path:'./assets/music/laviemday.mp3',
            image:'./assets/img/laviemday.jpg'
        },
        {
            name:'Gửi vợ tương lai',
            singer:'Long Nón Lá',
            path:'./assets/music/guivotuonglai.mp3',
            image:'./assets/img/guivotuonglai.jpg'
        },
        {
            name:'U are so sweet',
            singer:'D Empty',
            path:'./assets/music/uaresosweet.mp3',
            image:'./assets/img/uaresosweet.jpg'
        }
    ],
    setConfig:function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYRT_STORAGE,JSON.stringify(this.config));
    },
    render:function(){
        const htmls=this.songs.map((song,index) => {
            return `
                <div class="song  ${index===this.currentIndex?'active':''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fa fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML=htmls.join('\n')
    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents:function(){
        const _this=this
        const cdWidth=cd.offsetWidth
        // Xử lý cd quay /dừng
        const cdThumbAnimate=cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration:10000,
            iterations:Infinity
        })
        cdThumbAnimate.pause()
        // Xử lý phonhgs to thu nhỏ cd
        document.onscroll=function(){
            const scrollTop=window.scrollY||document.documentElement.scrollTop
            const newCdWidth=cdWidth-scrollTop
            cd.style.width= newCdWidth > 0 ? (Math.round(newCdWidth)+'px'):0
            cd.style.opacity=newCdWidth/cdWidth
        }
        // Xử lý khi click play 
        playBtn.onclick=function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay=function(){
            _this.isPlaying=true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song được pause
        audio.onpause=function(){
            _this.isPlaying=false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate=function(){
            if(audio.duration){
                const progressPercent=Math.floor(audio.currentTime/audio.duration*100)
                progress.value = progressPercent
            }
        }
        // Xử lý khi tua song
        progress.onchange=function(e){
            const seekTime=audio.duration/100*e.target.value
            audio.currentTime=seekTime
        }
        // khi next songs
        nextBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }          
            audio.play()
            _this.render()
            _this.scrollTopActiveSong()
        }
        // khi prev songs
        prevBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }            
            audio.play()
        }
        // Khi ramdom songs
        randomBtn.onclick=function(){
            _this.isRandom=!_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            this.classList.toggle('active',_this.isRandom)
        }
        // xử lý next song khi audio ended
        audio.onended=function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        // xử lý lặp lại 1 song
        repeatBtn.onclick=function(){
            _this.isRepeat=!_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat)
            this.classList.toggle('active',_this.isRepeat)
        }
        // lắng nghe hành vi click vào playlist
        playlist.onclick=function(e){
            const songNode=e.target.closest('.song:not(.active)')
            if(songNode||e.target.closest('option')){
                // xử lý khi click vào song
                if(songNode){
                    _this.currentIndex=Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }
        }
    },
    scrollTopActiveSong:function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            })
        },300)
    },
    loadConfig:function(){
        this.isRandom=this.config.isRandom;
        this.isRepeat=this.config.isRepeat;
    },
    loadCurrentSong:function(){
        heading.textContent =this.currentSong.name
        cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
        audio.src=this.currentSong.path
    },
    nextSong:function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong:function(){
        this.currentIndex--
        if(this.currentIndex <0){
            this.currentIndex=this.songs.length-1
        }
        this.loadCurrentSong()
    },
    playRandomSong:function(){
        let newIndex
        do{
            this.currentIndex=Math.floor(Math.random()*this.songs.length)
        }while(newIndex==this.currentIndex)
        this.loadCurrentSong()
    },

    start:function(){
        //  gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // Định nghĩa các thuộc tính cho objest
        this.defineProperties()

        // Lắng nghe/ xử lý các sự kiện (DOM event)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render Playlist
        this.render()
        // hiển thị trạng thái ban đàu của btn repeat và random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    },

}
app.start()