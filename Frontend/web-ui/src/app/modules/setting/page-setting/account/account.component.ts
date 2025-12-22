import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { UserProfileView } from '../../setting.model';
import { SettingService } from '../../setting.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  loading = false;
  currentUserId: string | null = null;
  userProfile: UserProfileView | null = null;
  selectedAvatarFile: File | undefined;
  avatarPreview: string | null = null;

  constructor(
    private toastr: ToastrService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    const stored = StorageHelper.getLocalStorageItem('_user_details');
    if (!stored) {
      this.toastr.error('No user session found. Please login again.');
      return;
    }

    const user = JSON.parse(stored);
    this.currentUserId = user?.id || user?.ID || null;

    if (this.currentUserId) {
      this.loadProfile(this.currentUserId);
    }
  }

  loadProfile(userId: string) {
    this.loading = true;
    this.settingService.getUserProfile(userId).subscribe({
      next: (profile: UserProfileView) => {
        this.userProfile = profile;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err || 'Failed to load profile');
      }
    });
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedAvatarFile = input.files[0];
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedAvatarFile);
    }
  }

  uploadPhoto() {
    if (!this.selectedAvatarFile || !this.currentUserId) {
      this.toastr.warning('Please select a photo first.');
      return;
    }

    this.loading = true;
    const payload = {
      id: this.currentUserId,
      name: this.userProfile?.name || '',
      email: this.userProfile?.email || '',
      role: this.userProfile?.role,
      subjects: this.userProfile?.subjects,
      semesters: this.userProfile?.semesters
    };

    this.settingService.updateUserProfile(payload, this.selectedAvatarFile).subscribe({
      next: () => {
        this.toastr.success('Photo uploaded successfully');
        this.loading = false;
        this.selectedAvatarFile = undefined;
        this.avatarPreview = null;
        // Reload profile to show updated avatar
        if (this.currentUserId) {
          this.loadProfile(this.currentUserId);
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err || 'Failed to upload photo');
      }
    });
  }

  isStudent(): boolean {
    return this.userProfile?.role === 'student';
  }

  isFaculty(): boolean {
    return this.userProfile?.role === 'faculty';
  }
}
