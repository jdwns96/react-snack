import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import AppFooter from "src/components/layout/footers/AppFooter";
import AppTemplate from "src/components/layout/templates/AppTemplate";
import { useUserFollowingCountQuery, useUserFollowingsQuery } from "src/query/user/following";

// module
import cn from "classnames";

// utils
import paginationUtil from "src/utils/pagination-util";
import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, Search } from "@mui/icons-material";
import { useAppSelector } from "src/store";

import { FollowSkeleton } from "src/components/common/skeleton";

/**
 * request
 * 1. 로그인 한 유저의 ID (서버에서 추출 가능)
 * 2. 보고있는 페이지 계정의 ID (dynamic query 로 추출)
 * 3. 필터 정렬 user_id (최신순, 오름차순, 내림차순)
 * 4. 검색 조건
 *
 * ?page=1&sort=[default | asc | desc]&search=""
 *
 *  만약 2 이 존재하지 않는경우 return 404;
 *
 * response
 * 1. total length
 * 2. list []
 */
export default function FollowingPage() {
  // redux
  const { id, user_id, name } = useAppSelector((store) => store.auth); // 접속한 사용자

  // get user_id from url
  const { user_id: url_user_id } = useParams<{ user_id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");

  const { isLoading: isFollowingCountLoading, data: followingCountData } = useUserFollowingCountQuery(url_user_id); // 팔로우 전체 목록
  const { isLoading: isFollowingsLoading, data: followingsData } = useUserFollowingsQuery(url_user_id, pageParam ?? "1"); // 쿼리 스트링이 없으면 1 보낸다.

  console.log(followingsData);

  const onFollow = () => {};
  const onUnFollow = () => {};

  const onClickPageIcon = (type: 1 | 2 | 3 | 4) => () => {
    if (followingCountData === undefined) return null;

    switch (type) {
      case 1:
        setSearchParams({ page: "1" });
        break;
      case 2:
        if (pageParam !== null && Number(pageParam) > 1) {
          setSearchParams({ page: String(Number(pageParam) - 1) });
        }
        break;
      case 3:
        if (Number(pageParam) < Math.ceil(followingCountData / 10)) {
          setSearchParams({ page: String(Number(pageParam ?? 1) + 1) });
        }
        break;
      case 4:
        if (followingCountData !== 0) {
          setSearchParams({ page: String(Math.ceil(followingCountData / 10)) });
        }
        break;
    }
  };

  return (
    <AppTemplate>
      <div className="w-full h-full">
        <div className="max-w-4xl mx-auto mt-6 px-4">
          <article className="bg-white shadow-md rounded-md mb-2 dark:bg-[#3D3D3D]">
            <header className="p-4 flex justify-between">
              <h1 className="text-xl ">
                <span className="font-semibold">{url_user_id}</span> 님의 팔로우 목록
              </h1>
              <div className="flex ">
                <button className="snack-btn text-sm rounded-r-none px-2 whitespace-nowrap">
                  <Link to="../followee" relative="path" className="grow">
                    팔로워
                  </Link>
                </button>
                <button className="snack-btn snack-btn--selected text-sm rounded-l-none px-2 -ml-1 whitespace-nowrap">
                  {/* <Link to="./" className="grow"> */}
                  팔로우
                  {/* </Link> */}
                </button>
              </div>
            </header>
            {/* <nav className="flex">
              <div>
                <Link to="../followee" relative="path">
                  <button className="snack-btn py-2">팔로워</button>
                </Link>
              </div>
              <div>
                <Link to="">
                  <button className="snack-btn py-2 bg-snack-bronze-200">팔로우</button>
                </Link>
              </div>
            </nav> */}
            <nav className="flex justify-between snack-border-b pb-3 px-4">
              <div className="flex">
                <div className="grow ">
                  <select id="countries" className="snack-input">
                    <option value="0">최신순</option>
                    <option value="1">오름차순</option>
                    <option value="2">내림차순</option>
                  </select>
                </div>
              </div>
              <div className="">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input type="text" id="simple-search" className="snack-input pl-10" placeholder="Search" required />
                </div>
              </div>
            </nav>
            <main>
              <div className="">
                {isFollowingsLoading
                  ? new Array(10).fill(0).map((_, i) => <FollowSkeleton />)
                  : followingsData?.map((v, i) => (
                      <div className="flex w-full justify-between border-b border-solid border-gray-300  p-3 md:px-5 dark:border-snack-gray-300" key={v.id}>
                        <div className="flex ">
                          <div>
                            <Link to={`/user/${v.user_id}`}>
                              <div className="rounded-full w-16 h-16 bg-gray-300"></div>
                            </Link>
                          </div>
                          <div className="ml-6">
                            <p>
                              <Link to={`/user/${v.user_id}`}>{v.name}</Link>
                            </p>
                            <p>{v.introduction ?? "-"}</p>
                          </div>
                        </div>
                        <div className="flex items-center">{id ? <button className="snack-btn">언팔로우</button> : <button className="snack-btn">팔로우</button>}</div>
                      </div>
                    ))}
              </div>
            </main>
            {isFollowingCountLoading ? (
              <div> skeleton </div>
            ) : (
              <article className="bg-white shadow-md rounded-md  w-full flex justify-center p-4 dark:bg-[#3D3D3D]">
                <ul className="flex  p-2">
                  <li className="mx-0.5">
                    <button className="w-8 h-8" onClick={onClickPageIcon(1)}>
                      <KeyboardDoubleArrowLeft />
                    </button>
                  </li>
                  <li className="mx-0.5">
                    <button className="w-8 h-8" onClick={onClickPageIcon(2)}>
                      <KeyboardArrowLeft />
                    </button>
                  </li>
                  {paginationUtil(followingCountData ?? 0, pageParam === null ? 1 : Number(pageParam), 5).map((v, i) => (
                    <Link key={v} to={`?page=${v}`}>
                      <li className="mx-0.5">
                        <button
                          className={cn(
                            "w-8 h-8 rounded-md hover:bg-gray-100 ",
                            v === Number(pageParam) && "border border-solid border-snack-bronze-200 text-snack-bronze-200",
                            v === 1 && pageParam === null && "border border-solid border-snack-bronze-200 text-snack-bronze-200",
                          )}
                        >
                          {v}
                        </button>
                      </li>
                    </Link>
                  ))}

                  <li className="mx-0.5">
                    <button className="w-8 h-8" onClick={onClickPageIcon(3)}>
                      <KeyboardArrowRight />
                    </button>
                  </li>
                  <li className="mx-0.5">
                    <button className="w-8 h-8" onClick={onClickPageIcon(4)}>
                      <KeyboardDoubleArrowRight />
                    </button>
                  </li>
                </ul>
              </article>
            )}
          </article>
        </div>
      </div>
      <AppFooter />
    </AppTemplate>
  );
}
