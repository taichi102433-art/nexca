(function(){
  'use strict';
  const KEY='nexca_ops_store_v2';
  const uid=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  const now=()=>new Date().toISOString();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const categories=['古着','カフェ','イベント・体験'];
  const areas=['広島県全域','広島市中区','広島市東区','広島市南区','広島市西区','広島市安佐南区','広島市安佐北区','広島市安芸区','広島市佐伯区','呉市','福山市','東広島市','廿日市市','尾道市','三原市','その他・県外'];
  const tagGroups={
    'シーン':['友達と','デート向け','1人でもOK','グループ向け','家族向け'],
    '条件':['無料','予約不要','雨の日OK','夜OK','学生向け','初心者OK','当日参加OK'],
    '魅力':['写真映え','穴場','癒し','交流できる','作れる','学べる','非日常','限定感'],
    'ジャンル補助':['古着好き向け','カフェ巡り','ものづくり','ライブ/音楽','マーケット','ワークショップ']
  };
  const tags=Object.values(tagGroups).flat();
  function sampleOrg(id,name,genre,area,icon,c1,c2){
    return {id,owner_user_id:'local-organizer',name,contact_name:'担当者',email:'hello@example.com',phone_number:'082-000-0000',instagram_url:'https://instagram.com/',website_url:'https://example.com/',description:name+'は、Nexcaで確認済みの掲載パートナーです。初めての人にも伝わるよう、雰囲気・料金・場所・楽しみ方を整理して掲載しています。',unique_info:'若い世代が行く前に判断しやすいよう、ショート動画・まとめ見・参加者の声を一つの導線にしています。',genres:[genre],area,address:area+' 周辺',icon,cover:[c1,c2],is_verified:true,is_initial_partner:true,discount_rate:30,created_at:'2026-05-01T00:00:00+09:00',updated_at:now()};
  }
  function sampleListing(id,organizer_id,title,catchcopy,category,media_type,area,price,event_date_type,start,end,hours,tags,code,icon,c1,c2,lat,lng){
    return {id,organizer_id,title,catchcopy,short_description:catchcopy,description:catchcopy+' 初めてでも判断しやすいよう、雰囲気・料金・場所・楽しみ方をNexcaで整理しています。',detail_info:'所要時間、混みやすい時間、初参加でも迷いにくいポイントまで確認できます。',unique_info:'Nexcaでは動画、まとめ見、主催者ページ、参加者の声がつながっているので、行く前の不安を減らせます。',notes:'参加後、マイページで参加コードを入力するとポイントがもらえます。',category,media_type,media_url:media_type==='flyer'?'':'sample-video',thumbnail_url:'',flyer_image_url:'',show_in_video_feed:media_type!=='flyer',show_in_flyer_view:true,tags,area,address:area+' 周辺',latitude:lat,longitude:lng,price_text:price,target_age_groups:['中学生','高校生','大学生','社会人'],event_date_type,start_date:start,end_date:end,business_hours:hours,reservation_url:'https://example.com/reserve',instagram_url:'https://instagram.com/',website_url:'https://example.com/',phone_number:'082-000-0000',show_phone:id==='v1'||id==='e1',accepts_nexca_interest:true,status:'published',is_archived:false,publish_at:'2026-05-01T00:00:00+09:00',created_at:'2026-05-01T00:00:00+09:00',updated_at:now(),icon,colors:[c1,c2],like_count:0,want_count:0,share_count:0,link_click_count:0};
  }
  function seed(){
    const organizers=[
      sampleOrg('org-vintage-loop','Loop Yard Hiroshima','古着','広島市中区','👕','#315f4c','#76b06f'),
      sampleOrg('org-soft-cafe','Soft Hour Cafe','カフェ','広島市西区','☕','#7a4b2a','#d99a57'),
      sampleOrg('org-popup-lab','Hiroshima Pop Lab','イベント・体験','広島市南区','🎪','#9d334a','#ef8b52')
    ];
    const listings=[
      sampleListing('v1','org-vintage-loop','Loop Yard 週末ラック','最初の一着が見つかる、やさしい古着ラック。','古着','video','広島市中区','¥1,000〜','evergreen','','','12:00-20:00',['古着好き向け','初心者OK','友達と'],'VINTAGE50','👕','#315f4c','#8dd07c',34.392,132.456),
      sampleListing('v2','org-vintage-loop','夜のリメイク相談室','眠っている服を、もう一度好きになる。','古着','video_with_thumbnail','広島市中区','相談無料','fixed_date','2026-05-24','2026-05-24','18:00-21:00',['夜OK','作れる','学生向け'],'REMAKE24','🧵','#3f315f','#9d75e8',34.393,132.459),
      sampleListing('v3','org-vintage-loop','古着はじめて市','学生向けの低価格ラックをまとめて見比べ。','古着','flyer','広島市西区','¥500〜','date_range','2026-05-18','2026-05-31','11:00-18:00',['マーケット','無料','古着好き向け'],'MARKET31','🛍️','#5a4b28','#e0b84f',34.402,132.438),
      sampleListing('c1','org-soft-cafe','Soft Hour 放課後ラテ','話したい日も、ひとりの日も、ちょうどいい一杯。','カフェ','video','広島市西区','¥450〜','evergreen','','','10:00-21:00',['カフェ巡り','1人でもOK','癒し'],'CAFE50','☕','#74411f','#df9a54',34.398,132.442),
      sampleListing('c2','org-soft-cafe','雨の日クリームソーダ','雨の日だけの静かな窓際席。','カフェ','video_with_thumbnail','広島市中区','¥680','date_range','2026-05-11','2026-06-10','13:00-19:00',['雨の日OK','写真映え','デート向け'],'RAIN68','🍹','#315c78','#75c8e8',34.389,132.455),
      sampleListing('c3','org-soft-cafe','朝の読書モーニング','スマホを置いて、30分だけ整える朝。','カフェ','flyer','廿日市市','¥700','evergreen','','','08:00-11:00',['1人でもOK','癒し','予約不要'],'MORNING7','📚','#6c5729','#e6c16d',34.349,132.331),
      sampleListing('e1','org-popup-lab','港のミニ音楽会','夕方の港で、知らない音に出会う。','イベント・体験','video','広島市南区','無料','fixed_date','2026-05-17','2026-05-17','17:00-19:00',['無料','ライブ/音楽','友達と'],'EVENT100','🎤','#9d334a','#ef8b52',34.360,132.468),
      sampleListing('e2','org-popup-lab','はじめての陶芸ワークショップ','不器用でも、自分の器ができる。','イベント・体験','video_with_thumbnail','東広島市','¥1,800','date_range','2026-05-18','2026-05-26','10:00-16:00',['ワークショップ','作れる','初心者OK'],'CLAY18','🏺','#734f32','#d0915a',34.426,132.743),
      sampleListing('e3','org-popup-lab','夜市ポップアップ','屋台、古着、音楽。週末だけの小さな非日常。','イベント・体験','flyer','尾道市','入場無料','fixed_date','2026-05-31','2026-05-31','16:00-21:00',['非日常','マーケット','当日参加OK'],'NIGHT31','🏮','#2f416b','#7aa6ef',34.409,133.205)
    ];
    return {version:2,profiles:[],organizers,organizer_contracts:[],listings,listing_applications:[],likes:[],wanted_listings:[],share_events:[],link_clicks:[],participation_codes:listings.map(l=>({id:'code-'+l.id,code:l.code||l.id.toUpperCase(),listing_id:l.id,organizer_id:l.organizer_id,category:l.category,is_active:true,max_uses:999,created_at:now()})),participation_code_redemptions:[],reviews:[{id:'rv-seed-1',user_id:'sample-user',listing_id:'c1',organizer_id:'org-soft-cafe',rating:5,comment:'雰囲気が分かりやすくて、初めてでも行きやすかった。',display_mode:'nickname',display_name:'高校生ユーザー',moderation_status:'approved',created_at:'2026-05-03T12:00:00+09:00'}],admin_actions:[],pricing_plans:[{id:'flyer',name:'チラシ掲載',description:'まとめ見掲載＋詳細ページ',price:0,billing_unit:'campaign',media_type:'flyer',is_active:true,is_free_until_2026_end:true,is_initial_partner_discount_target:true},{id:'video',name:'動画掲載',description:'動画フィード＋まとめ見＋詳細ページ',price:0,billing_unit:'campaign',media_type:'video',is_active:true,is_free_until_2026_end:true,is_initial_partner_discount_target:true},{id:'video_thumb',name:'動画＋サムネ掲載',description:'動画フィード＋まとめ見＋詳細ページ',price:0,billing_unit:'campaign',media_type:'video_with_thumbnail',is_active:true,is_free_until_2026_end:true,is_initial_partner_discount_target:true},{id:'production',name:'制作オプション',description:'撮影・編集・投稿文・キャッチコピー制作',price:null,billing_unit:'option',media_type:'all',is_active:true,is_free_until_2026_end:false,is_initial_partner_discount_target:false}],updated_at:now()};
  }
  function load(){try{const raw=localStorage.getItem(KEY);if(raw){const data=JSON.parse(raw);return {...seed(),...data};}}catch(e){}const s=seed();save(s);return s;}
  function save(data){data.updated_at=now();localStorage.setItem(KEY,JSON.stringify(data));return data;}
  function mutate(fn){const data=load();const res=fn(data)||data;save(data);return res;}
  function publicListings(){
    const n=new Date();
    return load().listings.filter(l=>l.status==='published'&&!l.is_archived&&(!l.publish_at||new Date(l.publish_at)<=n)&&(!l.end_date||new Date(l.end_date+'T23:59:59+09:00')>=n));
  }
  function organizerById(id){return load().organizers.find(o=>o.id===id);}
  function listingById(id){return load().listings.find(l=>l.id===id);}
  function profile(){try{return JSON.parse(localStorage.getItem('nexca_core_profile_v1')||'{}');}catch(e){return {};}}
  function actor(){const p=profile();return {user_id:p.id||'local-user',age_group:p.age||p.age_group||localStorage.getItem('nx_age')||'高校生',region:p.area||p.region||'広島市中区',nickname:p.nickname||'Nexcaユーザー'};}
  function upsertLike(listing_id){
    const a=actor();
    return mutate(d=>{const i=d.likes.findIndex(x=>x.user_id===a.user_id&&x.listing_id===listing_id);if(i>=0)d.likes.splice(i,1);else d.likes.push({id:uid('like'),user_id:a.user_id,listing_id,created_at:now()});const l=d.listings.find(x=>x.id===listing_id);if(l)l.like_count=d.likes.filter(x=>x.listing_id===listing_id).length;return i<0;});
  }
  function upsertWanted(listing_id){
    const a=actor();
    return mutate(d=>{const i=d.wanted_listings.findIndex(x=>x.user_id===a.user_id&&x.listing_id===listing_id);if(i>=0)d.wanted_listings.splice(i,1);else d.wanted_listings.push({id:uid('want'),user_id:a.user_id,listing_id,created_at:now()});const l=d.listings.find(x=>x.id===listing_id);if(l)l.want_count=d.wanted_listings.filter(x=>x.listing_id===listing_id).length;return i<0;});
  }
  function recordShare(listing_id){const a=actor();mutate(d=>{d.share_events.push({id:uid('share'),user_id:a.user_id,listing_id,created_at:now()});const l=d.listings.find(x=>x.id===listing_id);if(l)l.share_count=d.share_events.filter(x=>x.listing_id===listing_id).length;});}
  function recordClick(listing_id,link_type){const a=actor();mutate(d=>{const l=d.listings.find(x=>x.id===listing_id);d.link_clicks.push({id:uid('click'),user_id:a.user_id,listing_id,organizer_id:l?.organizer_id||'',link_type,age_group:a.age_group,region:a.region,created_at:now()});if(l)l.link_click_count=d.link_clicks.filter(x=>x.listing_id===listing_id).length;});}
  function redeemCode(code){
    const a=actor(), normalized=String(code||'').trim().toUpperCase();
    if(!normalized)return {ok:false,message:'コードを入力してください'};
    return mutate(d=>{const c=d.participation_codes.find(x=>x.code.toUpperCase()===normalized&&x.is_active);if(!c)return {ok:false,message:'コードが違います'};if(d.participation_code_redemptions.some(r=>r.user_id===a.user_id&&r.code_id===c.id))return {ok:false,message:'このコードは使用済みです'};d.participation_code_redemptions.push({id:uid('redeem'),code_id:c.id,code:c.code,user_id:a.user_id,listing_id:c.listing_id,organizer_id:c.organizer_id,redeemed_at:now()});return {ok:true,message:'参加済みになりました。参加者の声を投稿できます',code:c};});
  }
  function addReview(listing_id,rating,comment,anonymous){
    const a=actor(), l=listingById(listing_id);
    mutate(d=>d.reviews.push({id:uid('rv'),user_id:a.user_id,listing_id,organizer_id:l?.organizer_id||'',rating:Number(rating)||5,comment,display_mode:anonymous?'anonymous':'nickname',display_name:anonymous?'匿名':a.nickname,moderation_status:'pending',created_at:now()}));
  }
  function saveOrganizerProfile(p){
    return mutate(d=>{let o=d.organizers.find(x=>x.owner_user_id==='local-organizer'&&x.id==='org-local');if(!o){o={id:'org-local',owner_user_id:'local-organizer',is_verified:false,is_initial_partner:true,discount_rate:30,created_at:now()};d.organizers.unshift(o);}Object.assign(o,p,{updated_at:now(),genres:Array.isArray(p.genres)?p.genres:[p.genre||'イベント・体験']});return o;});
  }
  function submitApplication(row){
    return mutate(d=>{let org=d.organizers.find(o=>o.id===row.organizer_id)||d.organizers.find(o=>o.id==='org-local');if(!org)org=saveOrganizerProfile({name:'未登録主催者',area:'広島市中区',genres:['イベント・体験']});const listing_id=row.listing_id||uid('listing');const listing={id:listing_id,organizer_id:org.id,title:row.title,catchcopy:row.catchcopy,short_description:row.short_description||row.catchcopy,description:row.description,detail_info:row.detail_info,unique_info:row.unique_info,notes:row.notes,category:row.category,media_type:row.media_type,media_url:row.media_url,thumbnail_url:row.thumbnail_url,flyer_image_url:row.flyer_image_url,show_in_video_feed:false,show_in_flyer_view:true,tags:row.tags||[],area:org.area||row.area,address:row.address,latitude:row.latitude||null,longitude:row.longitude||null,price_text:row.price_text,target_age_groups:row.target_age_groups||[],event_date_type:row.event_date_type,start_date:row.start_date,end_date:row.end_date,business_hours:row.business_hours,reservation_url:row.reservation_url,instagram_url:row.instagram_url,website_url:row.website_url,phone_number:row.phone_number,show_phone:!!row.show_phone,accepts_nexca_interest:!!row.accepts_nexca_interest,status:'submitted',is_archived:false,publish_at:row.publish_at||'',created_at:now(),updated_at:now(),icon:row.category==='古着'?'👕':row.category==='カフェ'?'☕':'🎪',colors:row.category==='古着'?['#315f4c','#8dd07c']:row.category==='カフェ'?['#74411f','#df9a54']:['#9d334a','#ef8b52'],like_count:0,want_count:0,share_count:0,link_click_count:0};d.listings.unshift(listing);const app={id:uid('app'),organizer_id:org.id,listing_id,status:'submitted',submitted_at:now(),reviewed_at:'',admin_comment:'',organizer_reply:'',material_status:row.material_status,production_support_requested:!!row.production_support_requested,production_support_types:row.production_support_types||[],existing_media_urls:row.existing_media_urls||{},production_memo:row.production_memo||'',production_status:row.production_status||'not_needed',created_at:now(),updated_at:now(),priority:'通常',participation_code_requested:!!row.participation_code_requested};d.listing_applications.unshift(app);return app;});
  }
  function signContract(row){
    return mutate(d=>{const rec={id:uid('contract'),organizer_id:row.organizer_id||'org-local',user_id:'local-organizer',contract_version:'nexca_listing_terms_v1',signer_name:row.signer_name,company_or_store_name:row.company_or_store_name,agreed_to_terms:true,agreed_to_media_usage:true,agreed_to_accuracy:true,agreed_to_sns_usage:true,agreed_to_survey:true,signed_at:now(),created_at:now()};d.organizer_contracts.unshift(rec);return rec;});
  }
  function updateApplication(app_id,patch){
    return mutate(d=>{const app=d.listing_applications.find(a=>a.id===app_id);if(!app)return null;Object.assign(app,patch,{updated_at:now()});const l=d.listings.find(x=>x.id===app.listing_id);if(l&&patch.listing)Object.assign(l,patch.listing,{updated_at:now()});return app;});
  }
  function publishApplication(app_id,scheduledAt){
    return mutate(d=>{const app=d.listing_applications.find(a=>a.id===app_id);if(!app)return null;const l=d.listings.find(x=>x.id===app.listing_id);if(l){l.status=scheduledAt?'scheduled':'published';l.publish_at=scheduledAt||now();l.is_archived=false;l.show_in_video_feed=l.media_type!=='flyer'||!!l.show_in_video_feed;l.show_in_flyer_view=true;l.updated_at=now();}app.status=scheduledAt?'scheduled':'published';app.reviewed_at=now();app.updated_at=now();if(app.participation_code_requested&&!d.participation_codes.some(c=>c.listing_id===app.listing_id)){const code=(l.category==='古着'?'VINTAGE':l.category==='カフェ'?'CAFE':'EVENT')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();d.participation_codes.push({id:uid('code'),code,listing_id:l.id,organizer_id:l.organizer_id,category:l.category,is_active:true,max_uses:999,created_at:now()});}return app;});
  }
  function archiveListing(listing_id){mutate(d=>{const l=d.listings.find(x=>x.id===listing_id);if(l){l.status='archived';l.is_archived=true;l.updated_at=now();}});}
  function createTestApplication(){return submitApplication({organizer_id:'org-vintage-loop',title:'テスト申請：週末マーケット',catchcopy:'申請から公開までの流れを確認する掲載です。',description:'運営確認用のテスト掲載です。',detail_info:'内容確認、差し戻し、承認、参加コード発行を確認できます。',unique_info:'管理画面から公開するとユーザー画面に表示されます。',notes:'テスト用',category:'イベント・体験',media_type:'video_with_thumbnail',address:'広島市中区周辺',area:'広島市中区',price_text:'無料',target_age_groups:['高校生','大学生','社会人'],event_date_type:'fixed_date',start_date:'2026-05-30',end_date:'2026-05-30',business_hours:'13:00-17:00',tags:['無料','友達と','マーケット'],material_status:'既存投稿URLを使いたい',production_support_requested:true,production_support_types:['投稿文/キャッチコピー作成を相談したい'],existing_media_urls:{instagram:'https://instagram.com/'},production_memo:'テスト申請です。',production_status:'consultation_requested',participation_code_requested:true,accepts_nexca_interest:true});}
  function createTestReview(){const l=load().listings[0];addReview(l.id,5,'初参加でも雰囲気が分かって行きやすかったです。',false);}
  window.NexcaData={KEY,esc,uid,now,categories,areas,tags,tagGroups,load,save,mutate,publicListings,organizerById,listingById,actor,upsertLike,upsertWanted,recordShare,recordClick,redeemCode,addReview,saveOrganizerProfile,submitApplication,signContract,updateApplication,publishApplication,archiveListing,createTestApplication,createTestReview};
})();
