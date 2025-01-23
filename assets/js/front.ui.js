/*
 * name : front.ui.js
 * desc : UI 공통 스크립트
 * writer : 송지우
 * date : 2025/01/06
 * last : 2025/01/23
 */
var $_btnGoTop,
    $_headerWrapper,
    $_container,
    $_wrapper,
    _scrollTop = 0,
    _transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
    _vh,
    _resizeVh,
    _resizeVw,
    _sizeViewSta,
    _noScroll = false,
    _desktopWidth = 890;

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

    // 클릭 이벤트
    $_btnGoTop.off('click').on('click', function (e) {
        e.preventDefault();
        $('html, body').stop().queue('fx', []).animate({
            scrollTop: 0
        }, 250);
    });

    // 트랜지션 끝났을 때에만 class 노출 제어
    $_btnGoTop.on(_transitionEnd, function () {
        if (!$_btnGoTop.hasClass('is-active')) $_btnGoTop.addClass('is-hide');
    })

    // 스크롤 범위에 따라 class로 노출 제어
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
                entry.target.classList.add('reveal');

                // 위 실행을 처리하고(1회) 관찰 중지
                intersectionObserver.unobserve(entry.target)
            }
        });
    }, 
    {
        rootMargin: `0px 0px 50px 0px`, // 50px만 보여도 보이도록함(scss 타겟 기본 위치 translateY(100px))
        threshold: 0,
    });

    document.querySelectorAll('.reveal-tg').forEach((item) => {
        // 요소의 초기 상태 확인
        const rect = item.getBoundingClientRect();
        const isPastViewport = rect.bottom < 0; // 화면 상단을 지나갔는지 확인
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0; // 뷰포트에 있는지 확인

        // 뷰포트를 지난 경우 또는 현재 뷰포트에 있는 경우 reveal 클래스 추가
        if (isPastViewport || isInViewport) {
            item.classList.add('reveal');
        } else {
            intersectionObserver.observe(item);
        }
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

// smoothScroll 기능 추가
function smoothScroll() {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0);
}

$(document).ready(function () {
    $_wrapper = $('.wrapper');
    $_headerWrapper = $('.header-wrapper');
    $_container = $('.container-wrapper');
    $_btnGoTop = $('.btn-go-top');

    _vh = window.innerHeight;
    _resizeVh = window.innerHeight;
    _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;

    setMoHeader();
    setTableCaption();
    breakpointChangeInit();
    setGoTop();
    revealIntersectionObserve();
    smoothScroll();
    setPropertyVh();


    // 회전변경 이벤트 발생 시 : 100vh 스타일 지정
    $(window).on('resize orientationchange observerUpdate', function () {
        _resizeVh = window.outerHeight;
        _resizeVw = window.innerWidth || $(window).width() || document.body.clientWidth;
        _scrollTop = $(window).scrollTop();
        breakpointChangeInit();

        _resizeVh = window.innerHeight;
        setPropertyVh();
    });

});