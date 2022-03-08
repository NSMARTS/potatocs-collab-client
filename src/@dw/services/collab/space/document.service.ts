import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { MeetingListStorageService } from 'src/@dw/store/meeting-list-storage.service';
import { CommonService } from '../../common/common.service';
import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';


@Injectable({
	providedIn: 'root'
})
export class DocumentService {

	constructor(
		private http: HttpClient,
		private meetingListStorageService : MeetingListStorageService,
		private commonService: CommonService,
		private ddsService: DocDataStorageService,
	) { }

	createDoc(docData) {
		return this.http.post('/api/v1/collab/space/doc/create', docData);
	}

	// 문서 삭제
	deleteDoc(docId){	
		return this.http.delete('/api/v1/collab/space/doc/deleteDoc', {params: docId});
	}

	// doc 에 올려진 파일 목록 가져오기
	getUploadFileList(docId){
		return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
	}

	// 문서 일정 편집
	editDocDate(data){
		return this.http.post('/api/v1/collab/space/doc/editDoc', data).pipe(
			tap(
				(res: any) => {
					this.ddsService.updateDocs(res.spaceDocs);
					return res.message;
				}
			)
		);;
	}

	// 파일 업로드
	fileUpload(filedata, docId, description){
		const formData = new FormData();
		formData.append('file', filedata);
		formData.append('docId', docId);
		formData.append('description', description);
		console.log(formData);
		return this.http.post('/api/v1/collab/space/doc/fileUpload', formData);
	}

	// 업로드된 파일 다운로드
	fileDownload(fileId:any){
		// params를 쓸땐 객체로 보내야한다.
		return this.http.get('/api/v1/collab/space/doc/fileDownload', {params: {fileId: fileId}, responseType: 'blob'});
		// return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
	}

	//업로드된 파일 삭제
	deleteUploadFile(fileId){
		console.log(fileId);
		console.log(typeof(fileId))
		return this.http.delete('/api/v1/collab/space/doc/deleteUploadFile', {params: fileId});
	}
	
	// 채팅 생성
	createChat(data){
		return this.http.post('/api/v1/collab/space/doc/createChat', data)
	}

	// doc에 있는 채팅들 가져오기
	getChatInDoc(docId){
		return this.http.get('/api/v1/collab/space/doc/getChatInDoc', {params: docId})
	}

	// 채팅 삭제
	deleteChat(data){
		return this.http.delete('/api/v1/collab/space/doc/deleteChat', {params: data})
	}
	updateDoc(updateDocData) {
		return this.http.put('/api/v1/collab/space/doc/update', updateDocData);
	}
	getInfo(docId) {

		const httpParams = new HttpParams({
			fromObject: {
				docId
			}
		});

		// const paramData = {
		// 	spaceTime
		// }

		return this.http.get('/api/v1/collab/space/doc/getDocInfo', { params: httpParams });
	}

	// 미팅 생성
	createMeeting(data){
		return this.http.post('/api/v1/collab/space/doc/createMeeting', data).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingInDoc.length; index++) {
                    (res.meetingInDoc[index].start_date = this.commonService.dateFormatting(
                        res.meetingInDoc[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingInDoc);
					return res.message;
				}
			)
		);
	}

	// 미팅목록 가져오기
	getMeetingList(data){
		return this.http.get('/api/v1/collab/space/doc/getMeetingList', {params: data}).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingInDoc.length; index++) {
                    (res.meetingInDoc[index].start_date = this.commonService.dateFormatting(
                        res.meetingInDoc[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingInDoc);
					return res.message;
				}
			)
		);
	}

	// 미팅 삭제
	deleteMeeting(data){
		return this.http.delete('/api/v1/collab/space/doc/deleteMeeting', {params: data}).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingInDoc.length; index++) {
                    (res.meetingInDoc[index].start_date = this.commonService.dateFormatting(
                        res.meetingInDoc[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingInDoc);
					return res.message;
				}
			)
		);
	}

	// 미팅에 올라온 pdf 삭제
  	deleteMeetingPdfFile(data){
		console.log(data)
		return this.http.delete('https://test-potatocs.com/apim/v1/whiteBoard/deleteMeetingPdfFile', {params: data} );
		// http://localhost:4300/room/61d28a9ab53f13467d3f7991
	}

	// 미팅에서 채팅한 내용 삭제
	deleteAllOfChat(data) {
		console.log(data)
		return this.http.delete('https://test-potatocs.com/apim/v1/collab/deleteAllOfChat.', {params: data} );
		// return this.http.delete('http://localhost:4300/apim/v1/collab/deleteAllOfChat', {params: data} );
	}

	// 호스트가 미팅을 열었을때
	openMeeting(data){
		return this.http.post('/api/v1/collab/space/doc/openMeeting', data).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingInDoc.length; index++) {
                    (res.meetingInDoc[index].start_date = this.commonService.dateFormatting(
                        res.meetingInDoc[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingInDoc);
					return res.message;
				}
			)
		);
	}

	// 호스트가 미팅을 닫았을때
	closeMeeting(data){
		return this.http.post('/api/v1/collab/space/doc/closeMeeting', data).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingInDoc.length; index++) {
                    (res.meetingInDoc[index].start_date = this.commonService.dateFormatting(
                        res.meetingInDoc[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingInDoc);
					return res.message;
				}
			)
		);
	}

	// joinMeeting(data){
	// 	return this.http.post('https://localhost:3400/joinMeeting', data);
	// }
}

