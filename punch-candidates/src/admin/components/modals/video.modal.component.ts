import {HighlightDirective} from '../../directives/highlight.directive';
import {Component, Input, Output, ViewEncapsulation, EventEmitter, forwardRef} from 'angular2/core';
import {PROGRESSBAR_DIRECTIVES} from 'ng2-bootstrap';
import {FormatTimePipe} from '../../pipes/format-time.pipe';

@Component({
  selector: 'ar-video-modal',
  moduleId: module.id,
  templateUrl: 'video.modal.component.html',
  directives: [PROGRESSBAR_DIRECTIVES, forwardRef(() => HighlightDirective)],
  styleUrls: ['../../../css/admin/assets/stylesheets/components/modal.css'],
  encapsulation: ViewEncapsulation.None,
  pipes: [FormatTimePipe]
})
export class VideoModalComponent {
  @Input() flag;
  @Input() source;
  @Output() closed = new EventEmitter();

  videoProgress = 0; //between 0 and 100

  constructor() {
    this.flag = false;
  }

  toggleModalVisible(video) {
    this.flag = !this.flag;
    this.closed.emit('event');
    if (!video.paused) {
      video.pause();
      video.currentTime = 0;
    }
  }

  toggleFullScreen(video):void {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  }

  showVideo(video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  onTimeupdate(video) {
    this.videoProgress = Math.round((100 / video.duration) * video.currentTime);
  }

  onSeekFrame(event, video) {
    if(video.duration) {
      let width = event.target.parentElement.parentElement.offsetWidth;
      let currentProgress = event.x - event.target.parentElement.getBoundingClientRect().left;
      this.videoProgress = Math.round(currentProgress*100/width);
      video.currentTime = video.duration * this.videoProgress / 100;
    }
  }
}
