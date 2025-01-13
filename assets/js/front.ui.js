/*
 * name : front.ui.js
 * desc : UI 공통 자바스크립트
 * writer : 송지우
 * date : 2025/01/06
 * last : 
 */


var $_btnGoTop,
    $_headerWrapper,
    $_container,
    $_wrapper,
    _dialogCount = 0,
    _scrollTop = 0,
    _isIos,
    _isMac,
    _isAndroid,
    _transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
    _fisHeight = 0,
    _vh,
    _resizeVh,
    _resizeVw,
    _sizeViewSta,
    _noScroll = false,
    _desktopWidth = 890;



var portfolioPub = portfolioPub || {};


portfolioPub.front = portfolioPub.front || (function () {
    var _front;
    _front = {};

    /*
     * date : 20250106
     * last : 20250113
     * name : setMoHeader()
     * pram :
     * desc : mobile header - scroll up/down, current time update
     */
    function setMoHeader() {
        if ($_headerWrapper === undefined) return false;

        // scroll up/down 인지
        var $classList = [
                'header-wrapper',
            ],
            offset = $_headerWrapper.height() / 2, // scroll 사라지는 딜레이 시점을 주기 위해
            pageHeight = $_wrapper.outerHeight() - getBodyHeight() - $_headerWrapper.outerHeight(),
            prevScrollTop = 0;

        var sensor = new ResizeSensor($_wrapper, function () {
            if (_sizeViewSta === 'mobile') {
                pageHeight = $_wrapper.outerHeight() - getBodyHeight() - $_headerWrapper.outerHeight();
                scrollUpDown();
                if (_scrollTop === 0) {
                    $classList.forEach(function (target) {
                        $('.' + target).removeClass('scroll-up scroll-down');
                    });
                }
            }
        });

        createScrollStopListener(window, function () {
            if (_sizeViewSta === 'desktop') {
                $classList.forEach(function (target) {
                    $('.' + target).removeClass('scroll-up scroll-down');
                });
                return false;
            } else {
                scrollUpDown();
            }
        });

        // scrollUp/down check
        function scrollUpDown() {
            pageHeight = $_wrapper.outerHeight() - getBodyHeight() - $_headerWrapper.outerHeight();
            if ($_wrapper.outerHeight() <= _resizeVh + 31) return false;

            if (_noScroll) {
                $classList.forEach(function (target) {
                    var $target = $('.' + target);
                    if ($target.is(':animated')) return false;
                    if (!$target.hasClass('scroll-down')) $target.removeClass('scroll-up').addClass('scroll-down');
                });
                return false;
            }

            $classList.forEach(function (target) {
                var $target = $('.' + target);

                if ($target.hasClass('fixed') || $target.length === 0) return false;
                if ($('body').hasClass('dialog-open') || $('body').hasClass('sub-layer-open')) return false;

                // 스크롤 최상단
                if (_scrollTop === 0 || _scrollTop < 0 || _scrollTop <= offset) {
                    if ($target.hasClass('scroll-up') || $target.hasClass('scroll-down')) $target.removeClass('scroll-up scroll-down');
                } else {
                    // 스크롤 내릴	때
                    if (prevScrollTop < _scrollTop && _scrollTop > offset) {
                        if (!$target.hasClass('scroll-down')) {
                            $target.removeClass('scroll-up').addClass('scroll-down');
                        }
                    }
                    // 스크롤 올릴 때
                    else {
                        if (_scrollTop < pageHeight && _scrollTop > offset) {
                            if (!$target.hasClass('scroll-up')) {
                                $target.removeClass('scroll-down').addClass('scroll-up');
                            }
                        }
                    }

                }
            });

            prevScrollTop = _scrollTop;
            return false;
        }

        //실시간 시간 반영
        let koreaTarget = $('.current-time .time');

        function getkoreaTime() {
            var nD = new Date();
            var koreaTime = ("0" + nD.getHours()).slice(-2) + ":" + ("0" + nD.getMinutes()).slice(-2) + ":" + ("0" + nD.getSeconds()).slice(-2);
            koreaTarget.text(koreaTime);
        }

        getkoreaTime();
        setInterval(getkoreaTime, 1000); // 1초마다 실행
    }

    /*
     * date : 250106
     * last : 250106
     * name : setGoTop()
     * pram :
     * desc : 최상단 이동 버튼
     */
    function setGoTop() {
        var offset = $_headerWrapper.length > 0 ? $_headerWrapper.height() * 1.5 : 30;
        btnOnOff();

        $_btnGoTop.off('click').on('click', function (e) {
            e.preventDefault();
            $('html, body').stop().queue('fx', []).animate({
                scrollTop: 0
            }, 250);
        });


        $_btnGoTop.on(_transitionEnd, function () {
            if (!$_btnGoTop.hasClass('is-active')) $_btnGoTop.addClass('is-hide');
        })

        $(window).off('scroll', btnOnOff).on('scroll', btnOnOff);

        function btnOnOff() {
            offset = $_headerWrapper.length > 0 ? $_headerWrapper.height() * 1.5 : 30;
            if (_scrollTop >= offset) {
                if (!$_btnGoTop.hasClass('is-active')) $_btnGoTop.removeClass('is-hide').addClass('is-active');
            } else {
                if ($_btnGoTop.hasClass('is-active')) $_btnGoTop.addClass('is-hide').removeClass('is-active');
            }
        }
    }

    /*
     * date : 250106
     * last : 250106
     * name : setTableCaption()
     * pram :
     * desc : 테이블 캡션 생성
     */
    function setTableCaption() {
        $("table[class*='tbl-info']").each(function (index) {
            var table, captionComplex, theadHeader, tbodyHeader;
            table = $(this);
            captionTextOrigin = $(this).find("caption").text();
            captionComplex = '';
            theadHeader = [];
            tbodyHeader = [];

            // thead th값 추출
            if (table.find("thead th").length > 0) {
                table.find("thead th").each(function (index) {
                    theadHeader.push($(this).text());
                });
            }
            // tbody th값 추출
            if (table.find("tbody th").length > 0) {
                table.find("tbody th").each(function (index) {
                    // tbody th가 thead th의 서브 헤더인 경우(thead th와 tbody th가 둘 다 존재하는 경우)
                    if (theadHeader.length > 0) {
                        if (tbodyHeader[$(this).index()] === undefined) {
                            tbodyHeader[$(this).index()] = theadHeader[$(this).index()] + " 컬럼의 하위로";
                        }
                        tbodyHeader[$(this).index()] += " " + $(this).text();
                    } else {
                        tbodyHeader.push($(this).text());
                    }
                });

                tbodyHeader = tbodyHeader.filter(function (n) {
                    return n != undefined
                });
            }

            if (theadHeader.length > 0 && tbodyHeader.length > 0) {
                captionComplex += theadHeader.join(", ") + " " + tbodyHeader.join(", ");
            } else if (theadHeader.length > 0) {
                captionComplex += theadHeader.join(", ");
            } else if (tbodyHeader.length > 0) {
                captionComplex += tbodyHeader.join(", ");
            }

            $(this).find("caption").text(captionTextOrigin + " 테이블로 " + captionComplex + '을(를) 나타낸 표입니다.');
        });
    }

    /*
     * date : 250106
     * last : 250106
     * name : revealIntersectionObserve()
     * pram :
     * desc : reveal intersection observer
     */
    function revealIntersectionObserve() {
        const intersectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('cont-tit')) {
                        titSplitRevealAni($(entry.target));
                    } else {
                        entry.target.classList.add('reveal');
                    }

                    // 위 실행을 처리하고(1회) 관찰 중지
                    intersectionObserver.unobserve(entry.target)
                }
            });
        }, {
            rootMargin: `0px 0px 0px 0px`,
            threshold: 0,
        });

        document.querySelectorAll('.reveal-tg').forEach((item) => {
            intersectionObserver.observe(item);
        });

        // 타이틀 split 애니메이션
        function titSplitRevealAni(selector) {
            selector = selector || '.cont-tit';

            selector.html(
                selector.text()
                .split("")
                .map((letter, idx) => {
                    if (letter === " ") return " ";
                    return `<span style="animation-delay:${
                    idx * 45
                }ms" class="reveal-item">${letter}</span>`;
                })
                .join("")
            );
        }
    }

    /*
     * date : 250106
     * last : 250106
     * name : setBgChange()
     * pram :
     * desc : 배경색 변경 gsap
     */
    function setBgChange() {
        gsap.utils.toArray('.cont-box').forEach((item) => {
            let bgColor = item.getAttribute('data-bgcolor');
            let textColor = bgColor === "#000" ? "#fff" : "#000"; // 검은 배경 흰 텍스트, 흰 배경 검은 텍스트

            ScrollTrigger.create({
                trigger: item,
                start: 'top 30%',
                end: 'bottom 30%',
                markers: true,

                onEnter: () => {
                    gsap.to('.container-wrapper', {
                        backgroundColor: bgColor,
                        color: textColor, // 텍스트 색상 변경
                        duration: 1.2,
                    });
                },
                onEnterBack: () => {
                    gsap.to(".container-wrapper", {
                        backgroundColor: bgColor,
                        color: textColor, // 텍스트 색상 변경
                        duration: 1.2,
                    });
                },
            });
        });
    }

    /*
     * date : 250106
     * last : 250106
     * name : setWorkHoverCursor()
     * pram :
     * desc : work hover cursor
     */
    function setWorkHoverCursor() {
        $(".experience-item .link-site").on("mouseenter", function () {
            const $emoji = $(this).find(".media-emoji");

            $(this).on("mousemove", function (event) {
                const offsetX = event.pageX - $(this).offset().left - 50;
                const offsetY = event.pageY - $(this).offset().top - 50;

                // GSAP 애니메이션 적용
                gsap.to($emoji, {
                    left: offsetX.toFixed(0),
                    top: offsetY.toFixed(0),
                    duration: .9,
                    ease: "power3"
                });
            });
        });

        $(".experience-item .link-site").on("mouseleave", function () {
            const $emoji = $(this).find(".media-emoji");
            $(this).off("mousemove"); // mousemove 이벤트 해제
        });
    }

    /*
     * date : 250106
     * last : 250106
     * name : createScrollStopListener(element, callback)
     * pram :
     *		@param element  - 스크롤 영역 요소
     *		@param callback - 스크롤이 끝나고 callback 함수
     * desc : 스크롤이 끝난 후 callback 함수 실행
     */
    function createScrollStopListener(element, callback) {
        var handle = null;
        var onScroll = function () {
            var mobileType = navigator.userAgent.toLowerCase();
            var delay = (mobileType.indexOf('iphone') > -1 || mobileType.indexOf('ipad') > -1 || mobileType.indexOf('ipod') > -1) ? 0 : 15;

            if (handle) clearTimeout(handle);
            handle = setTimeout(callback, delay);
        };

        clearTimeout($(document).data('scrollEnd'));

        $(window).on('scroll', function (event) {
            _scrollTop = $(window).scrollTop();
            if ($(document).data('scrollEnd')) clearTimeout($(document).data('scrollStopListener'));
            $(document).data('scrollEnd', setTimeout(onScroll, event));
        });

        return function () {
            clearTimeout($(document).data('scrollEnd'));
            $(window).on('scroll', function (event) {
                _scrollTop = $(window).scrollTop();
                if ($(document).data('scrollEnd')) clearTimeout($(document).data('scrollStopListener'));
                $(document).data('scrollEnd', setTimeout(onScroll, event));
            });
        };
    }

    // sps set
    if (window.ScrollPosStyler) {
        ScrollPosStyler.init({
            classAbove: 'sps-abv',
            classBelow: 'sps-blw',
        });
    }

    $(document).on("touchstart", function (e) {
        _fisHeight = window.innerHeight;
    });

    /*
     * date : 250106
     * last : 250106
     * name : breakpointChangeInit()
     * pram :
     * desc : breakpoint 변경될때 초기화
     */
    function breakpointChangeInit() {
        // desktop
        if (_resizeVw > _desktopWidth) {
            if (!$('body').hasClass('desktop') || $_headerWrapper === undefined) {
                $('body').addClass('desktop');
                _sizeViewSta = 'desktop';
            }

        }
        // mobile
        else {
            if ($('body').hasClass('desktop') || $_headerWrapper === undefined) {
                $('body').removeClass('desktop');
                _sizeViewSta = 'mobile';
            }

        }
    }

    function getBodyHeight() {
        var myHeight = 0;
        if (typeof (window.innerHeight) == 'number') myHeight = window.innerHeight;
        else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) myHeight = document.documentElement.clientHeight;
        else if (document.body && (document.body.clientWidth || document.body.clientHeight)) myHeight = document.body.clientHeight;
        return myHeight;
    }


    function setPropertyVh() {
        document.documentElement.style.setProperty('--vh', _vh + 'px');
        document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
    }

    /**
     * date : 20220901
     * last : 20220901
     * name : debounce()
     * pram :
     *        @param func {function} 실행 함수
     *        @param wait {number} 시간 지정 ( 지정 시간 지난 후 함수 실행 )
     * desc : 지정 시간 끝난 후 함수 실행
     * ex) $contWrap.on('scroll',portfolioPub.front.debounce(test, 400));
     */
    function debounce(func, wait) {
        var inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            // setTimeout이 실행된 Timeout의 ID를 반환하고, clearTimeout()으로 이를 해제할 수 있음을 이용
            clearTimeout(inDebounce);

            inDebounce = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // smoothScroll
    function smoothScroll() {
        const lenis = new Lenis();

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0);
    }

    _front.breakpointChangeInit = breakpointChangeInit;

    _front.debounce = debounce;

    $(document).on("touchstart", function (e) {
        _fisHeight = window.innerHeight;
    });

    createScrollStopListener(window, function () {
        if ($('.ui-dialog-container.open').length > 0) return false;
        if (_isIos && _isMac && window.innerHeight !== _fisHeight) {
            //_resizeVh = (window.innerHeight + 1);
            _resizeVh = getBodyHeight * 0.01;
            document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
        } else if (_isAndroid && window.outerHeight !== _fisHeight) {
            _resizeVh = window.outerHeight;
            document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
        }
    });

    $(document).ready(function () {
        $_headerWrapper = $('.header-wrapper');
        $_btnGoTop = $('.btn-go-top');
        $_container = $('.container-wrapper');
        $_wrapper = $('.wrapper');


        _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;

        setMoHeader();
        setTableCaption();
        breakpointChangeInit();
        setGoTop();
        setBgChange();
        setWorkHoverCursor();
        revealIntersectionObserve();
        smoothScroll();

        /* 맥 OS 또는 iOS / android 디바이스 체크 */
        _isIos = /(iPhone|iPod|iPad)/i.test(navigator.platform);
        _isMac = /(Mac)/i.test(navigator.platform);
        _isAndroid = /Android/i.test(navigator.userAgent);


        if (_isIos) {
            _vh = getBodyHeight * 0.01;
            _resizeVh = getBodyHeight * 0.01;
            setPropertyVh();
            $('body').addClass('ios');
        }
        if (_isMac) {
            _vh = getBodyHeight * 0.01;
            _resizeVh = getBodyHeight * 0.01;
            setPropertyVh();
            $('body').addClass('mac');
        }
        if (_isAndroid) {
            _vh = window.outerHeight;
            _resizeVh = window.outerHeight;
            setPropertyVh();
            $('body').addClass('android');
        } else {
            _vh = window.innerHeight;
            _resizeVh = window.innerHeight;
            setPropertyVh();
        }


        // 회전변경 이벤트 발생 시 : 100vh 스타일 지정
        $(window).on('resize orientationchange observerUpdate', function () {
            _resizeVh = window.outerHeight;
            _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;
            _scrollTop = $(window).scrollTop();
            breakpointChangeInit();

            if (_isIos && _isMac) {
                _resizeVh = getBodyHeight * 0.01;
                setPropertyVh();
            }
            if (_isAndroid) {
                _resizeVh = window.outerHeight;
                setPropertyVh();
            } else {
                _resizeVh = window.innerHeight;
                setPropertyVh();
            }
        });

    });

    return _front;
})();