import React, { useEffect } from 'react';
import get from 'lodash/get';
import CodeEditor from 'components/CodeEditor';
import FormUrlEncodedParams from 'components/RequestPane/FormUrlEncodedParams';
import MultipartFormParams from 'components/RequestPane/MultipartFormParams';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'providers/Theme';
import { updateRequestBody } from 'providers/ReduxStore/slices/collections';
import { sendRequest, saveRequest } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper from './StyledWrapper';
import { updateCodeMirrorsHeight } from 'utils/common/codemirror';

const RequestBody = ({ item, collection }) => {
  const dispatch = useDispatch();
  const body = item.draft ? get(item, 'draft.request.body') : get(item, 'request.body');
  const bodyMode = item.draft ? get(item, 'draft.request.body.mode') : get(item, 'request.body.mode');
  const { displayedTheme } = useTheme();
  const preferences = useSelector((state) => state.app.preferences);

  useEffect(() => {
    updateCodeMirrorsHeight('#request-body', 65, 'calc(100vh - 250px)');
  });

  const onEdit = (value) => {
    dispatch(
      updateRequestBody({
        content: value,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const onRun = () => dispatch(sendRequest(item, collection.uid));
  const onSave = () => dispatch(saveRequest(item.uid, collection.uid));

  if (['json', 'xml', 'text', 'sparql'].includes(bodyMode)) {
    let codeMirrorMode = {
      json: 'application/ld+json',
      text: 'application/text',
      xml: 'application/xml',
      sparql: 'application/sparql-query'
    };

    let bodyContent = {
      json: body.json,
      text: body.text,
      xml: body.xml,
      sparql: body.sparql
    };

    return (
      <StyledWrapper id="request-body" className="w-full">
        <CodeEditor
          collection={collection}
          theme={displayedTheme}
          font={get(preferences, 'font.codeFont', 'default')}
          value={bodyContent[bodyMode] || ''}
          onEdit={onEdit}
          onRun={onRun}
          onSave={onSave}
          mode={codeMirrorMode[bodyMode]}
        />
      </StyledWrapper>
    );
  }

  if (bodyMode === 'formUrlEncoded') {
    return <FormUrlEncodedParams item={item} collection={collection} />;
  }

  if (bodyMode === 'multipartForm') {
    return <MultipartFormParams item={item} collection={collection} />;
  }

  return <StyledWrapper className="w-full">No Body</StyledWrapper>;
};
export default RequestBody;
