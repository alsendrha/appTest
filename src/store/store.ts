import BottomSheet from '@gorhom/bottom-sheet';
import {RefObject} from 'react';
import {ScrollView} from 'react-native';
import {create} from 'zustand';

type PageInfo = {
  pageInfo: string;
  setPageInfo: (pageName: string) => void;
};

type BottomSheetRefType = {
  bottomSheetRef: RefObject<BottomSheet>;
  setBottomSheetRef: (ref: RefObject<BottomSheet>) => void;
};

type ScrollRefType = {
  scrollRef: RefObject<ScrollView>;
  setScrollRef: (ref: RefObject<ScrollView>) => void;
};

type AreaSelected = {
  areaSelected: string;
  setAreaSelected: (area: string) => void;
};

type ItemInfo = {
  itemTitle: string;
  itemId: string;
  contentTypeId: string;
  setItemTitle: (item: string) => void;
  setItemId: (id: string) => void;
  setContentTypeId: (type: string) => void;
};

type ContentsSelected = {
  contentsSelected: number;
  contentTitle: string;
  setContentsSelected: (contents: number, title: string) => void;
};

type RefetchStore = {
  refetchReviews: (() => void) | null;
  setRefetchReviews: (refetch: () => void) => void;
};

type ImagePicker = {
  imageData: {
    uri: string | undefined;
    type: string | undefined;
    fileName: string | undefined;
  };
  setImageData: (data: {
    uri: string | undefined;
    type: string | undefined;
    fileName: string | undefined;
  }) => void;
};

type LoadingType = {
  loadingTitle: string;
  setLoadingTitle: (loadingTitle: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const usePageInfo = create<PageInfo>(set => ({
  pageInfo: '',
  setPageInfo: pageName => set({pageInfo: pageName}),
}));

export const useBottomSheetRef = create<BottomSheetRefType>(set => ({
  bottomSheetRef: {current: null},
  setBottomSheetRef: ref => set({bottomSheetRef: ref}),
}));

export const useScrollRef = create<ScrollRefType>(set => ({
  scrollRef: {current: null},
  setScrollRef: ref => set({scrollRef: ref}),
}));

export const useAreaSelected = create<AreaSelected>(set => ({
  areaSelected: '서울',
  setAreaSelected: area => set({areaSelected: area}),
}));

export const useContentsSelected = create<ContentsSelected>(set => ({
  contentsSelected: 12,
  contentTitle: '관광지',
  setContentsSelected: (contents, title) =>
    set({contentsSelected: contents, contentTitle: title}),
}));

export const useItemInfo = create<ItemInfo>(set => ({
  itemTitle: '',
  itemId: '',
  contentTypeId: '',
  setItemTitle: item => set({itemTitle: item}),
  setItemId: id => set({itemId: id}),
  setContentTypeId: type => set({contentTypeId: type}),
}));

export const useRefetchStore = create<RefetchStore>(set => ({
  refetchReviews: null,
  setRefetchReviews: refetch => set({refetchReviews: refetch}),
}));

export const useImagePicker = create<ImagePicker>(set => ({
  imageData: {
    uri: '',
    type: '',
    fileName: '',
  },
  setImageData: data => set({imageData: data}),
}));

export const useLoading = create<LoadingType>(set => ({
  loadingTitle: '',
  setLoadingTitle: (loadingTitle: string) => set({loadingTitle}),
  loading: false,
  setLoading: (loading: boolean) => set({loading}),
}));
