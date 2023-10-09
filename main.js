// 1. Render songs
// 2. Scroll top
// 3. Play / pause / seek
// 4. CD rotate
// 5. Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. scroll active song into view 
// 10. Play song when click
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8-PLAYER';

const player = $('.player');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app ={
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'À Lôi',
            singer: 'Double2',
            path: './assest/Music/ALoi-Double2TMasew-10119691.mp3',
            image: './assest/img/À Lôi.jpg'
        },
        {
            name: 'Để Tôi Ôm Em Bằng Giai Điệu Này',
            singer: 'KaiDinh-Min-Greyd',
            path: './assest/Music/DeToiOmEmBangGiaiDieuNay-KaiDinhMINGREYD-8416034.mp3',
            image: './assest/img/Để tôi ôm em.jpg'
        },
        {
            name: 'Đưa Em Về Nhà',
            singer: 'Greyd-Chillies',
            path: './assest/Music/DuaEmVeNhaa-GREYDChillies-9214678.mp3',
            image: './assest/img/Đưa em về nhà.jpg'
        },
        {
            name: 'Ghosting',
            singer: 'LeBao',
            path: './assest/Music/GhostingLeBaoRemix-LinhKa-9541355.mp3',
            image: './assest/img/Ghost.jpg'
        },
        {
            name: 'Không Yêu Xin Đừng Nói Ra',
            singer: 'Umie',
            path: './assest/Music/KhongYeuXinDungNoiPianoVersion-UMIE-8852977.mp3',
            image: './assest/img/Umie.jpg'
        },
        {
            name: 'Mùa Hè Tuyệt Vời Nhất',
            singer: 'DucPhuc',
            path: './assest/Music/MuaHeTuyetVoiLalawonder-DucPhuc-9835888.mp3',
            image: './assest/img/Mùa hè tuyệt vời__Đức Phúc.jpg'
        }
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return  `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas ti-more-alt"></i>
            </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('\n')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function(){
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        // xu ly cd quay va dung
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: `rotate(360deg)`
            }],{
                duration: 10000,
                iterations: Infinity
            })
            cdThumbAnimate.pause();

        // xu ly phong to thu nho cd
        
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // xu ly khi click play  
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
            
        }
        // khi song duoc play 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // khi song pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            
        }

        // xu ly khi tua nhac 
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value 
            audio.currentTime = seekTime;
        }

        // khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
                }

        // khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.preSong();
            }
                    audio.play();
                    _this.render();
                    -this.scrollToActiveSong();
                }

        // khi random song
        randomBtn.onclick = function(){
                    _this.isRandom = !_this.isRandom;
                    _this.setConfig('isRandom', _this.isRandom);
                    randomBtn.classList.toggle('active',_this.isRandom);
                    
                }

        // xu ly phat lai song
        repeatBtn.onclick = function(){
                    _this.isRepeat =!_this.isRepeat;
                    _this.setConfig('isRepeat', _this.isRepeat);
                    repeatBtn.classList.toggle('active',_this.isRepeat);
                }

        // xu ly khi next song 
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
            
        }

        // lang nghe hanh vi click 
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)') 
                    if(songNode || e.target.closest('.option')){
                        // xu ly khi click vao song
                        
                    
                        if(songNode)
                        {
                            // console.log(songNode.dataset.index)
                            _this.currentIndex = Number(songNode.dataset.index);
                            _this.loadCurrentSong();
                            _this.render();
                            audio.play();
                            
                        }

                        // xu ly khi click vao song option
                        if(e.targer.closest('.option')){
                            alert('Please select')
                        }
                    }
                    // audio.play();
                  
                }
                
    },

    scrollToActiveSong: function(){
        setTimeout(()=>{
             $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center'
             });
        },300)
    },

    loadCurrentSong: function(){
        

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading, cdThumb, audio)
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom 
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length ){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    preSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function (){
        // gan cau hinh tu config vao object
        this.loadConfig();
        // dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        // lang nghe // xu ly cac su kien (Dom event)
        this.handleEvent()

        // Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // hien thi trang thai ban dau 
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start();